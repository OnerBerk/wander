import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center bg-slate-950 px-6 text-white">
      <section className="max-w-lg text-center">
        <p className="text-wander-orange text-sm font-semibold tracking-[0.35em] uppercase">Erreur 404</p>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl">Page introuvable</h1>
        <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg">
          La page demandée n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="bg-wander-orange focus-visible:ring-wander-orange mt-8 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
        >
          Retour à l'accueil
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
