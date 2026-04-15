import Link from 'next/link';
import { DiagnosticRunner } from '@/components/diagnostic-runner';
import { fetchPreguntasActivas } from './actions';

interface PageProps {
  searchParams: { lead_id?: string };
}

export default async function DiagnosticoPage({ searchParams }: PageProps) {
  const leadId = searchParams.lead_id;

  if (!leadId) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            Necesitamos tus datos primero
          </h1>
          <p className="text-sm text-slate-500">
            Regresa a la página principal para iniciar tu diagnóstico gratuito.
          </p>
          <Link
            href="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-3 rounded-2xl transition"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const preguntas = await fetchPreguntasActivas();

  if (preguntas.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Estamos preparando las preguntas
          </h1>
          <p className="text-sm text-slate-500 mt-3">
            El banco de preguntas aún no está disponible. Inténtalo en unos minutos.
          </p>
        </div>
      </main>
    );
  }

  return <DiagnosticRunner leadId={leadId} preguntas={preguntas} />;
}
