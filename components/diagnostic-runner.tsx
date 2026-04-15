'use client';

import { useMemo, useState, useTransition } from 'react';
import { submitDiagnostic } from '@/app/diagnostico/actions';
import type { PreguntaDiagnostico, RespuestaUsuario } from '@/types/diagnostico';

interface Props {
  leadId: string;
  preguntas: PreguntaDiagnostico[];
}

const ETIQUETA_TIPO: Record<PreguntaDiagnostico['tipo_pregunta'], string> = {
  tipo_I: 'Tipo I · Selección múltiple',
  tipo_II: 'Tipo II · Afirmaciones',
  tipo_III: 'Tipo III · Afirmación + Razón',
  comportamental: 'Comportamental · Likert',
};

export function DiagnosticRunner({ leadId, preguntas }: Props) {
  const total = preguntas.length;
  const [idx, setIdx] = useState(0);
  const [elecciones, setElecciones] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const preguntaActual = preguntas[idx];
  const claveElegida = elecciones[preguntaActual?.id] ?? null;
  const esUltima = idx === total - 1;

  const progreso = useMemo(() => {
    const contestadas = Object.keys(elecciones).length;
    return Math.round((contestadas / total) * 100);
  }, [elecciones, total]);

  function elegir(clave: string) {
    setElecciones((prev) => ({ ...prev, [preguntaActual.id]: clave }));
  }

  function avanzar() {
    if (!claveElegida) return;
    if (!esUltima) {
      setIdx((i) => i + 1);
      return;
    }
    const respuestas: RespuestaUsuario[] = preguntas.map((p) => ({
      pregunta_id: p.id,
      clave_elegida: elecciones[p.id],
    }));
    setSubmitError(null);
    startTransition(async () => {
      try {
        await submitDiagnostic({ leadId, respuestas });
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Error al enviar.');
      }
    });
  }

  function retroceder() {
    if (idx > 0) setIdx((i) => i - 1);
  }

  if (!preguntaActual) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center">
        <p className="text-slate-500">No hay preguntas activas por el momento.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md px-6 py-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-900">
              Pregunta {idx + 1} de {total}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {progreso}% completado
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-10 pt-8 pb-40">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {ETIQUETA_TIPO[preguntaActual.tipo_pregunta]}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{preguntaActual.tema}</span>
          </div>

          <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed mb-8">
            {preguntaActual.enunciado}
          </h2>

          <div className="space-y-3">
            {preguntaActual.opciones_json.map((op) => {
              const seleccionada = claveElegida === op.clave;
              return (
                <button
                  key={op.clave}
                  type="button"
                  onClick={() => elegir(op.clave)}
                  disabled={isPending}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl transition flex items-start gap-4 ${
                    seleccionada
                      ? 'bg-white ring-2 ring-yellow-400 shadow-md shadow-yellow-400/20'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      seleccionada
                        ? 'bg-yellow-400 text-slate-900'
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    {op.clave}
                  </span>
                  <span className="text-sm md:text-base text-slate-800 leading-relaxed pt-1">
                    {op.texto}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {submitError && (
          <div className="mt-6 bg-rose-50 text-rose-700 text-sm rounded-2xl px-5 py-4">
            {submitError}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 md:px-10 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={retroceder}
            disabled={idx === 0 || isPending}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={avanzar}
            disabled={!claveElegida || isPending}
            className="flex-1 md:flex-none md:min-w-[260px] bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold py-4 rounded-2xl shadow-lg shadow-yellow-400/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending
              ? 'Enviando…'
              : esUltima
              ? 'Enviar diagnóstico'
              : 'Siguiente pregunta'}
          </button>
        </div>
      </div>
    </div>
  );
}
