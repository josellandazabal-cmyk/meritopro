import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseSSRClient } from '@/lib/supabase/ssr';

export default async function DashboardPage() {
  const supabase = getSupabaseSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('linea_base_diagnostico_id, nivel_cargo, profesion')
    .eq('id', user.id)
    .single();

  const { data: diagnostico } = profile?.linea_base_diagnostico_id
    ? await supabase
        .from('diagnostics')
        .select('indice_preparacion, modulo_mas_debil')
        .eq('id', profile.linea_base_diagnostico_id)
        .single()
    : { data: null };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
        <div className="space-y-2">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
            Dashboard · Línea base activada
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Bienvenido a MéritoPro
          </h1>
          <p className="text-sm text-slate-600">
            Tu cuenta está activa como <strong>{user.email}</strong>. Desde aquí arrancamos el
            entrenamiento hacia la Procuraduría.
          </p>
        </div>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Tu línea base
          </p>
          {diagnostico ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-slate-900 tracking-tight">
                  {Number(diagnostico.indice_preparacion).toFixed(0)}
                </span>
                <span className="text-lg font-semibold text-slate-500">/ 100</span>
              </div>
              <p className="text-sm text-slate-600">
                Índice de preparación registrado en tu diagnóstico inicial. Lo usaremos como punto
                de partida para medir tu avance semana a semana.
              </p>
              {diagnostico.modulo_mas_debil && (
                <p className="text-sm text-slate-700">
                  Módulo prioritario: <strong>{diagnostico.modulo_mas_debil}</strong>
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Aún no se ha vinculado tu diagnóstico. Vuelve a tomarlo desde el inicio.
            </p>
          )}
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Próximo paso
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Configuraremos tu plan de estudio con el Orquestador IA.
          </h2>
          <p className="text-sm text-slate-600">
            En el siguiente paso del roadmap se activan Sidebar, módulos de estudio y tutor virtual.
          </p>
        </section>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
