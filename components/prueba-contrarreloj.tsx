'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { PREGUNTAS_CONTRARRELOJ, type PreguntaContrarreloj } from '@/lib/simulacion/preguntas-mock';
import { calcularSM2, calidadDesdeRespuesta, SM2_DEFAULT } from '@/lib/sm2';

const LIMITE_MS = 15000;

type Resultado = {
  id: string;
  correcta: boolean;
  tiempoMs: number;
  efactor: number;
  intervalo: number;
};

export function PruebaContrarreloj() {
  const [indice, setIndice] = useState(0);
  const [inicioMs, setInicioMs] = useState<number>(() => Date.now());
  const [restanteMs, setRestanteMs] = useState(LIMITE_MS);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [eleccion, setEleccion] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const pregunta: PreguntaContrarreloj | undefined = PREGUNTAS_CONTRARRELOJ[indice];

  useEffect(() => {
    if (completado || eleccion !== null) return;
    const id = setInterval(() => {
      const dt = LIMITE_MS - (Date.now() - inicioMs);
      if (dt <= 0) {
        clearInterval(id);
        registrar(null);
      } else {
        setRestanteMs(dt);
      }
    }, 100);
    return () => clearInterval(id);
  }, [inicioMs, eleccion, completado]);

  function registrar(clave: string | null) {
    if (!pregunta) return;
    const tiempoMs = Date.now() - inicioMs;
    const correcta = clave === pregunta.correcta;
    const calidad = calidadDesdeRespuesta({ correcta, tiempoMs, limiteMs: LIMITE_MS });
    const sm2 = calcularSM2(SM2_DEFAULT, calidad);
    setEleccion(clave);
    setResultados((r) => [
      ...r,
      { id: pregunta.id, correcta, tiempoMs, efactor: sm2.efactor, intervalo: sm2.interval },
    ]);
  }

  function siguiente() {
    if (indice + 1 >= PREGUNTAS_CONTRARRELOJ.length) {
      setCompletado(true);
      return;
    }
    setIndice((i) => i + 1);
    setEleccion(null);
    setInicioMs(Date.now());
    setRestanteMs(LIMITE_MS);
  }

  function reiniciar() {
    setIndice(0);
    setEleccion(null);
    setInicioMs(Date.now());
    setRestanteMs(LIMITE_MS);
    setResultados([]);
    setCompletado(false);
  }

  const aciertos = useMemo(() => resultados.filter((r) => r.correcta).length, [resultados]);
  const pct = restanteMs / LIMITE_MS;

  if (completado) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Contrarreloj finalizada
        </p>
        <p className="text-5xl font-bold text-slate-900 tracking-tight">
          {aciertos}/{PREGUNTAS_CONTRARRELOJ.length}
        </p>
        <p className="text-sm text-slate-600">
          El algoritmo SM-2 actualizó los intervalos de repaso según tu tiempo y precisión.
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold py-4 rounded-2xl shadow-lg shadow-yellow-400/30 transition"
        >
          Repetir sesión
        </button>
      </div>
    );
  }

  if (!pregunta) return null;

  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {indice + 1} / {PREGUNTAS_CONTRARRELOJ.length}
        </span>
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold tabular-nums">
            {(restanteMs / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] ${
            pct > 0.5 ? 'bg-emerald-500' : pct > 0.2 ? 'bg-amber-400' : 'bg-rose-500'
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug">
        {pregunta.enunciado}
      </h3>

      <div className="grid gap-3">
        {pregunta.opciones.map((op) => {
          const esCorrecta = op.clave === pregunta.correcta;
          const esElegida = op.clave === eleccion;
          const mostrarEstado = eleccion !== null;
          const base =
            'w-full text-left px-5 py-4 rounded-2xl border transition flex items-center gap-3';
          let cls = `${base} border-slate-200 hover:border-yellow-400 hover:bg-yellow-50`;
          if (mostrarEstado) {
            if (esCorrecta) cls = `${base} border-emerald-300 bg-emerald-50`;
            else if (esElegida) cls = `${base} border-rose-300 bg-rose-50`;
            else cls = `${base} border-slate-100 bg-slate-50 opacity-60`;
          }
          return (
            <button
              key={op.clave}
              type="button"
              disabled={mostrarEstado}
              onClick={() => registrar(op.clave)}
              className={cls}
            >
              <span className="text-xs font-bold text-slate-500 w-6">{op.clave}</span>
              <span className="text-sm text-slate-800 flex-1">{op.texto}</span>
              {mostrarEstado && esCorrecta && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {mostrarEstado && esElegida && !esCorrecta && (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
            </button>
          );
        })}
      </div>

      {eleccion !== null && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Base normativa: <strong>{pregunta.norma}</strong>
          </p>
          <button
            type="button"
            onClick={siguiente}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-4 rounded-2xl transition"
          >
            {indice + 1 >= PREGUNTAS_CONTRARRELOJ.length ? 'Ver resultado' : 'Siguiente'}
          </button>
        </div>
      )}
    </div>
  );
}
