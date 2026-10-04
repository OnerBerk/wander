import { mkdir, readdir, rename, stat, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcAssets = path.join(webRoot, 'src/assets');
const originalsDir = path.join(webRoot, 'assets-src');
const publicMarine = path.join(webRoot, 'public/bg-marine.webp');

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} Ko`;

const walkPngs = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkPngs(fullPath)));
      continue;
    }
    if (entry.name.endsWith('.png')) files.push(fullPath);
  }

  return files;
};

const resizeFor = (fileName) => {
  if (fileName === 'bg-marine.png' || fileName === 'bg-crem.png') {
    return { resize: { width: 1920, withoutEnlargement: true }, quality: 70 };
  }

  if (fileName.includes('logo')) {
    return { resize: { width: 200, withoutEnlargement: true }, quality: 80 };
  }

  // Plus grand affichage fixe : h-60 (240px) dans header-list. h-40 sur la carte.
  if (fileName.startsWith('weather-')) {
    return { resize: { height: 480, withoutEnlargement: true }, quality: 80 };
  }

  if (fileName.startsWith('marker-') || fileName.endsWith('-marker.png')) {
    return { resize: { width: 80, withoutEnlargement: true }, quality: 80 };
  }

  // Icônes de ligne affichées en 32px (md:h-8).
  if (fileName.startsWith('paris-subway') || fileName.startsWith('paris-rer')) {
    return { resize: { width: 64, withoutEnlargement: true }, quality: 80 };
  }

  return { resize: { width: 1920, withoutEnlargement: true }, quality: 70 };
};

const moveOriginalsOutOfSrc = async () => {
  let pngs = [];
  try {
    pngs = await walkPngs(srcAssets);
  } catch {
    return;
  }

  for (const filePath of pngs) {
    const relativePath = path.relative(srcAssets, filePath);
    const destination = path.join(originalsDir, relativePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(filePath, destination);
  }
};

const main = async () => {
  await moveOriginalsOutOfSrc();

  const pngs = await walkPngs(originalsDir);
  let before = 0;
  let after = 0;

  for (const filePath of pngs) {
    const relativePath = path.relative(originalsDir, filePath);
    const fileName = path.basename(filePath);
    const { resize, quality } = resizeFor(fileName);
    const outputPath = path.join(srcAssets, relativePath.replace(/\.png$/, '.webp'));
    const sourceStat = await stat(filePath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(filePath).resize(resize).webp({ quality }).toFile(outputPath);

    const outputStat = await stat(outputPath);
    before += sourceStat.size;
    after += outputStat.size;

    if (fileName === 'bg-marine.png') {
      await copyFile(outputPath, publicMarine);
    }

    console.log(`${relativePath}: ${formatKb(sourceStat.size)} -> ${formatKb(outputStat.size)}`);
  }

  console.log(`Total: ${formatKb(before)} -> ${formatKb(after)}`);
};

await main();
