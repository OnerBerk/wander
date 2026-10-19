import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageMessageProps {
  title: string;
  to?: string;
  linkLabel?: string;
}

const PageMessage = ({ title, to, linkLabel }: PageMessageProps) => {
  return (
    <main className="flex min-h-0 flex-1 flex-col px-4 py-6">
      {to ? (
        <Link to={to} aria-label="Retour" className="inline-flex w-fit">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : null}
      <h1 className="mt-8 text-2xl font-semibold">{title}</h1>
      {to && linkLabel ? (
        <Link to={to} className="text-wander-orange mt-4 underline">
          {linkLabel}
        </Link>
      ) : null}
    </main>
  );
};

export default PageMessage;
