import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  params: { id: string };
}

export default async function ResultadoPage({ params }: PageProps) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('diagnostics')
    .select('indice_preparacion, modulo_mas_fuerte, modulo_mas_debil')
    .eq('id', params.id)
    .single();

  const indice = data?.indice_preparacion ?? null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center space-y-5">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
          Diagnóstico completado
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          {indice !== null ? `${indice}% de preparación` : '¡Listo!'}
        </h1>
        <p className="text-sm text-slate-500">
          En el Paso 4 mostraremos aquí tu radar por módulo, el pitch de ROI y el paywall
          definitivo. Por ahora, esta pantalla confirma que tu diagnóstico se guardó
          correctamente.
        </p>
        {data?.modulo_mas_debil && (
          <div className="bg-slate-100 rounded-2xl p-4 text-left">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
              Brecha prioritaria
            </p>
            <p className="text-sm font-semibold text-slate-900">{data.modulo_mas_debil}</p>
          </div>
        )}
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
