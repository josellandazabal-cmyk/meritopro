import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';

interface PageProps {
  params: { id: string };
}

const ETIQUETAS_MODULO: Record<string, string> = {
  ofimatica: 'Ofimática',
  aptitud_verbal: 'Aptitud Verbal y Comprensión Lectora',
  normas_servicio_publico: 'Normas del Servicio Público',
  gestion_documental: 'Gestión Documental',
  atencion_ciudadano_gestion: 'Atención al Ciudadano y Sistemas de Gestión',
  eje_disciplinario: 'Eje Disciplinario',
  eje_constitucional_ddhh: 'Constitucional y DDHH',
  eje_administrativo_cpaca: 'Administrativo y CPACA',
  eje_gestion_transparencia: 'Gestión y Transparencia',
  eje_financiero_contable: 'Financiero y Contable',
  eje_sistemas_tecnologia: 'Sistemas y Tecnología',
  eje_forense_criminalistica: 'Forense y Criminalística',
  eje_infraestructura_obras: 'Infraestructura y Obras',
  comportamental: 'Competencias Comportamentales',
};

function etiquetaModulo(clave: string | null): string {
  if (!clave) return 'Sin datos';
  return ETIQUETAS_MODULO[clave] ?? clave;
}

function clasificarIndice(indice: number): {
  color: string;
  bg: string;
  ring: string;
  titulo: string;
  mensaje: string;
} {
  if (indice >= 70) {
    return {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-200',
      titulo: 'Buen punto de partida',
      mensaje:
        'Estás por encima del umbral aprobatorio (65/100). Aún así, la lista de elegibles exige 70 ponderado y hay puntos ciegos normativos que pueden costarte la plaza.',
    };
  }
  if (indice >= 50) {
    return {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-200',
      titulo: 'Riesgo moderado',
      mensaje:
        'Estás cerca del umbral pero aún por debajo del mínimo aprobatorio (65/100). Sin un plan estructurado, la convocatoria se te escapa por diferencias de 1 o 2 puntos.',
    };
  }
  return {
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200',
    titulo: 'Brecha crítica',
    mensaje:
      'Estás muy por debajo del umbral aprobatorio (65/100). Hoy no pasarías la etapa de conocimientos. Necesitas un plan quirúrgico sobre tus módulos débiles.',
  };
}

export default async function ResultadoPage({ params }: PageProps) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('diagnostics')
    .select('indice_preparacion, modulo_mas_fuerte, modulo_mas_debil, lead_id')
    .eq('id', params.id)
    .single();

  const indice = Number(data?.indice_preparacion ?? 0);
  const moduloDebil = etiquetaModulo(data?.modulo_mas_debil ?? null);
  const moduloFuerte = etiquetaModulo(data?.modulo_mas_fuerte ?? null);
  const clasif = clasificarIndice(indice);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
            Diagnóstico completado
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Tu línea base frente a la Procuraduría
          </h1>
        </div>

        <section
          className={`${clasif.bg} ${clasif.ring} ring-1 rounded-3xl p-10 md:p-12 text-center`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Índice de Preparación
          </p>
          <div className={`text-7xl md:text-8xl font-bold tracking-tight ${clasif.color}`}>
            {indice.toFixed(0)}
            <span className="text-3xl md:text-4xl font-semibold align-top">%</span>
          </div>
          <p className={`mt-4 text-lg font-semibold ${clasif.color}`}>{clasif.titulo}</p>
          <p className="mt-3 text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
            {clasif.mensaje}
          </p>
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2">
              Tu brecha prioritaria
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
              {moduloDebil}
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Este es el módulo donde más fallaste. En el concurso de la PGN, un módulo débil arrastra
              el puntaje global por debajo del 70 exigido para quedar en la lista de elegibles —
              aunque el resto lo hagas bien.
            </p>
          </div>

          {data?.modulo_mas_fuerte && (
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">
                Tu fortaleza
              </p>
              <p className="text-base font-semibold text-slate-900">{moduloFuerte}</p>
              <p className="mt-2 text-sm text-slate-600">
                Aquí partes con ventaja. El plan personalizado la consolida sin desperdiciar horas.
              </p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Retorno de inversión
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
            Recuperas la inversión con tu primer salario en la Procuraduría.
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Un cargo profesional en la PGN supera los <strong>$4.000.000 COP</strong> mensuales y
            la lista de elegibles tiene vigencia de 2 años. Lo que inviertes hoy se paga solo con
            los primeros días de nómina del cargo.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Plan de estudio ajustado a tus brechas reales (no a un temario genérico).
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Banco de preguntas Tipo I, II y III con retroalimentación normativa exacta.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Tutor virtual con IA especializado en Decreto Ley 262/2000.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Acceso ilimitado hasta la fecha del concurso. Pago único.
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 text-center space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Pase Integral MéritoPro
            </p>
            <p className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              $197.000 <span className="text-base font-semibold text-slate-500">COP</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">Pago único · Acceso hasta el concurso</p>
          </div>
          <Link
            href={
              data?.lead_id
                ? `/checkout?lead_id=${data.lead_id}&diagnostico_id=${params.id}`
                : '/checkout'
            }
            className="block w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold text-base md:text-lg py-5 rounded-2xl shadow-lg shadow-yellow-400/30 transition"
          >
            Desbloquear Pase Integral — $197.000 COP
          </Link>
          <p className="text-xs text-slate-500">
            Sin suscripciones, sin renovaciones automáticas. Si no pasas el concurso, conservas el
            acceso hasta la próxima convocatoria.
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
