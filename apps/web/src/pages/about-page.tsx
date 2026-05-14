import SeoMetadata from '@/components/seo/seo-metadata';

const AboutPage = () => {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center bg-slate-950 px-6 text-white">
      <SeoMetadata
        title="À propos | Wander"
        description="Découvrez bientôt l'histoire de Wander, la carte interactive de Paris par Ön-Air studio."
        canonicalPath="/about"
      />
      <section className="max-w-xl text-center">
        <p className="text-wander-orange text-sm font-semibold tracking-[0.35em] uppercase">Wander</p>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl">Page en construction</h1>
        <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg">
          La page À propos arrive bientôt. Elle présentera le projet, sa vision et les données publiques utilisées pour
          explorer Paris autrement.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
