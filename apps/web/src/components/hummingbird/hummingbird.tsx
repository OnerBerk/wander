import { useEffect } from 'react';
import type * as THREE_NS from 'three';
import colibriUrl from '@/assets/glb/colibri.glb?url';

type Three = typeof THREE_NS;

type Props = {
  /** Sélecteur CSS de l'élément sur lequel le colibri se pose, ex. '[data-colibri-cible]' */
  targetSelector: string;
  /** Adresse du fichier GLB */
  src?: string;
};

// ---------- réglages ----------
const FLIGHT = 7.5; // temps de vol en 8 avant de se poser (secondes)
const LANDING = 2.4; // durée de la descente (secondes)
const PITCH = 0.5; // inclinaison du corps en vol : 0 = debout, plus grand = plus horizontal (radians)
const LAND_PITCH = 0.05; // inclinaison une fois posé
const HEAD_LEAD = 0.45; // à quel point la tête anticipe le virage (0 = jamais)
// ------------------------------

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Déforme le modèle (une seule pièce, sans squelette) : battement d'ailes + rotation de la tête. */
const addBirdDeform = (THREE: Three, mesh: THREE_NS.Mesh) => {
  const geo = mesh.geometry;
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const uniforms = {
    uPhase: { value: 0 },
    uAmp: { value: 0.55 },
    uHead: { value: 0 },
    uC: { value: new THREE.Vector2((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2) },
    uHalf: { value: (bb.max.x - bb.min.x) / 2 },
    uHalfY: { value: (bb.max.y - bb.min.y) / 2 },
    uBB0: { value: bb.min.clone() },
    uBB1: { value: bb.max.clone() },
  };
  (mesh.material as THREE_NS.Material).onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uPhase, uAmp, uHalf, uHalfY, uHead; uniform vec2 uC; uniform vec3 uBB0, uBB1;
        float flapAngle(vec3 p){
          float dx = p.x - uC.x;
          float w = smoothstep(0.15 * uHalf, 0.6 * uHalf, abs(dx));
          w *= smoothstep(-0.35 * uHalfY, 0.05 * uHalfY, p.y - uC.y);
          return sign(dx) * w * uAmp * sin(uPhase);
        }
        vec2 rot2(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c*v.x - s*v.y, s*v.x + c*v.y); }
        float headAngle(vec3 p){
          vec3 f = (p - uBB0) / (uBB1 - uBB0);
          return uHead * smoothstep(0.55, 0.7, f.z) * smoothstep(0.35, 0.5, f.y);
        }
        vec2 rotXZ(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c*v.x + s*v.y, -s*v.x + c*v.y); }`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
        objectNormal.xy = rot2(objectNormal.xy, flapAngle(position));
        objectNormal.xz = rotXZ(objectNormal.xz, headAngle(position));`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        transformed.xy = uC + rot2(transformed.xy - uC, flapAngle(position));
        vec3 neck = uBB0 + (uBB1 - uBB0) * vec3(0.5, 0.6, 0.62);
        transformed.xz = neck.xz + rotXZ(transformed.xz - neck.xz, headAngle(position));`,
      );
  };
  return uniforms;
};

const Hummingbird = ({ targetSelector, src = colibriUrl }: Props) => {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    const start = async () => {
      // Three.js et le GLB ne sont chargés qu'ici, après l'affichage de la page.
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
        import('three'),
        import('three/addons/loaders/GLTFLoader.js'),
        import('three/addons/libs/meshopt_decoder.module.js'),
        import('three/addons/environments/RoomEnvironment.js'),
      ]);
      if (cancelled) return;

      // Pas de WebGL : on n'affiche rien, le site fonctionne normalement.
      let renderer: THREE_NS.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch (e) {
        console.error('[Hummingbird] WebGL indisponible', e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '50',
      });
      document.body.appendChild(canvas);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      // Caméra en pixels : (0,0) en bas à gauche de l'écran.
      const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1000, 1000);
      const pivot = new THREE.Group();
      pivot.rotation.order = 'ZYX'; // l'inclinaison se fait dans le plan de l'écran
      scene.add(pivot);

      let model: THREE_NS.Object3D;
      let uniforms: ReturnType<typeof addBirdDeform> | undefined;
      let modelHeight = 1;
      try {
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(src);
        model = gltf.scene;
      } catch (e) {
        console.error('[Hummingbird] chargement du GLB impossible', e);
        canvas.remove();
        renderer.dispose();
        return;
      }
      if (cancelled) {
        canvas.remove();
        renderer.dispose();
        return;
      }

      model.traverse((o) => {
        const m = o as THREE_NS.Mesh;
        if (!m.isMesh) return;
        const mat = m.material as THREE_NS.MeshStandardMaterial;
        mat.roughness = Math.max(mat.roughness, 0.55);
        mat.metalness = Math.min(mat.metalness, 0.2);
        uniforms = addBirdDeform(THREE, m);
      });
      const box = new THREE.Box3().setFromObject(model);
      model.position.sub(box.getCenter(new THREE.Vector3()));
      modelHeight = box.getSize(new THREE.Vector3()).y;
      pivot.add(model);

      // ---------- état ----------
      let W = 0,
        H = 0,
        size = 100;
      let t = 0,
        last = 0,
        raf = 0;
      let landed = false;
      let yaw = Math.PI / 2 - 0.4;
      let head = 0;
      let phase = 0;
      let landFrom = { x: 0, y: 0 };
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Cible : milieu du bord haut de l'élément (coordonnées écran, y vers le bas)
      const target = () => {
        const el = document.querySelector(targetSelector);
        if (el) {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top - size * 0.4 };
        }
        return { x: W * 0.85, y: H * 0.9 };
      };
      const faceCenter = (tx: number) => (tx > W / 2 ? -1 : 1) * (Math.PI / 2 - 0.5);

      const put = (x: number, y: number) => pivot.position.set(x, H - y, 0);

      const placeLanded = () => {
        const g = target();
        const yawEnd = faceCenter(g.x);
        put(g.x, g.y);
        pivot.rotation.set(0, yawEnd, -Math.sign(yawEnd) * LAND_PITCH);
        if (uniforms) {
          uniforms.uAmp.value = 0;
          uniforms.uPhase.value = 0;
          uniforms.uHead.value = 0;
        }
      };

      const resize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        renderer.setSize(W, H, false);
        camera.right = W;
        camera.top = H;
        camera.updateProjectionMatrix();
        size = Math.min(Math.max(Math.min(W, H) * 0.12, 60), 105);
        pivot.scale.setScalar(size / modelHeight);
        if (landed) {
          placeLanded();
          renderer.render(scene, camera);
        }
      };
      window.addEventListener('resize', resize);
      resize();

      // Vol en 8 (plan de l'écran)
      const fig8 = (tt: number) => {
        const th = (tt * Math.PI * 2) / 6;
        return {
          x: W * 0.5 + Math.min(W * 0.14, 180) * Math.sin(th),
          y: H * 0.38 + H * 0.13 * Math.sin(2 * th),
          vx: Math.cos(th),
        };
      };

      const update = (dt: number) => {
        if (!uniforms) return;
        let x: number,
          y: number,
          vx = 0,
          vy = 0,
          freq = 6,
          amp = 0.55,
          landYaw = yaw,
          pitch = PITCH;

        if (t < FLIGHT) {
          const p = fig8(t),
            p2 = fig8(t + 0.05);
          const enter = 1 - easeInOut(Math.min(t / 1.6, 1)); // arrive par la gauche
          x = p.x - enter * W * 0.8;
          y = p.y + Math.sin(phase * 0.5) * size * 0.03;
          vx = p.vx;
          vy = (p2.y - p.y) / 0.05;
          landFrom = { x, y };
        } else {
          const k = Math.min((t - FLIGHT) / LANDING, 1);
          const u = easeInOut(k);
          const g = target();
          const cx = landFrom.x + (g.x - landFrom.x) * 0.3,
            cy = g.y - H * 0.22;
          const a = (1 - u) * (1 - u),
            b = 2 * (1 - u) * u,
            c = u * u;
          x = a * landFrom.x + b * cx + c * g.x;
          y = a * landFrom.y + b * cy + c * g.y;
          vx = g.x - landFrom.x;
          vy = (1 - u) * 60;
          landYaw = faceCenter(g.x);
          freq = 6 - 3 * k;
          amp = 0.55 * (1 - Math.max(0, (k - 0.5) / 0.5));
          pitch = LAND_PITCH + (PITCH - LAND_PITCH) * (1 - u); // se redresse en se posant
          if (k >= 1) landed = true;
        }

        phase += dt * freq * Math.PI * 2;
        uniforms.uPhase.value = phase;
        uniforms.uAmp.value = amp;

        const wantYaw = t < FLIGHT ? Math.sign(vx || 1) * (Math.PI / 2 - 0.4) : landYaw;
        // La tête prend de l'avance sur le corps dans le sens du virage, puis le corps suit.
        const headTarget = Math.max(-0.7, Math.min(0.7, (wantYaw - yaw) * HEAD_LEAD));
        head += (headTarget - head) * Math.min(1, dt * 8);
        uniforms.uHead.value = head;

        yaw += (wantYaw - yaw) * Math.min(1, dt * 5);
        const facing = Math.sign(yaw) || 1;
        const dive = Math.max(-0.15, Math.min(0.15, vy * 0.0004)); // pique du nez en descendant
        pivot.rotation.set(0, yaw, -facing * (pitch + dive));
        put(x, y);
      };

      const frame = (now: number) => {
        const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        t += dt;
        update(dt);
        renderer.render(scene, camera);
        // Une fois posé : on arrête la boucle, plus aucun calcul.
        if (!landed) raf = requestAnimationFrame(frame);
        else {
          placeLanded();
          renderer.render(scene, camera);
        }
      };

      if (reduce) {
        landed = true;
        placeLanded();
        renderer.render(scene, camera);
      } else raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        scene.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (!m.isMesh) return;
          m.geometry.dispose();
          const mat = m.material as THREE_NS.Material;
          Object.values(mat).forEach((v) => {
            if (v instanceof THREE.Texture) v.dispose();
          });
          mat.dispose();
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        canvas.remove();
      };
    };

    const id = window.setTimeout(start, 1200); // laisse la carte s'afficher d'abord
    return () => {
      cancelled = true;
      window.clearTimeout(id);
      cleanup();
    };
  }, [targetSelector, src]);

  return null;
};

export default Hummingbird;
