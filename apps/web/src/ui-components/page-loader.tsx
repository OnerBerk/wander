import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageLoaderProps {
  to?: string;
}

const PageLoader = ({ to }: PageLoaderProps) => {
  return (
    <main className="flex min-h-0 flex-1 flex-col px-4 py-6">
      {to ? (
        <Link to={to} aria-label="Retour" className="inline-flex w-fit">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : null}
      <span
        role="status"
        aria-label="Chargement"
        className="mt-8 inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
      />
    </main>
  );
};

export default PageLoader;
