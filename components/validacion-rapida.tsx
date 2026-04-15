'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { CRITERIOS_RAPIDOS, type CriterioRapido } from '@/lib/simulacion/preguntas-mock';

const UMBRAL = 120;

interface Marcado {
  id: string;
  respuesta: boolean;
  correcta: boolean;
  explicacion: string;
}

export function ValidacionRapida() {
  const [indice, setIndice] = useState(0);
  const [marcados, setMarcados] = useState<Marcado[]>([]);

  const criterio: CriterioRapido | undefined = CRITERIOS_RAPIDOS[indice];
  const siguienteCriterio = CRITERIOS_RAPIDOS[indice + 1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacityV = useTransform(x, [40, 140], [0, 1]);
  const opacityF = useTransform(x, [-140, -40], [1, 0]);

  function registrar(respuesta: boolean) {
    if (!criterio) return;
    setMarcados((m) => [
      ...m,
      {
        id: criterio.id,
        respuesta,
        correcta: respuesta === criterio.esVerdadero,
        explicacion: criterio.explicacion,
      },
    ]);
    x.set(0);
    setIndice((i) => i + 1);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > UMBRAL) registrar(true);
    else if (info.offset.x < -UMBRAL) registrar(false);
    else x.set(0);
  }

  function reiniciar() {
    setIndice(0);
    setMarcados([]);
    x.set(0);
  }

  if (!criterio) {
    const aciertos = marcados.filter((m) => m.correcta).length;
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 text-center">
          Validación finalizada
        </p>
        <p className="text-5xl font-bold text-slate-900 tracking-tight text-center">
          {aciertos}/{CRITERIOS_RAPIDOS.length}
        </p>
        <ul className="space-y-3 text-sm">
          {marcados.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl p-4 ring-1 ${
                m.correcta
                  ? 'bg-emerald-50 ring-emerald-200 text-emerald-800'
                  : 'bg-rose-50 ring-rose-200 text-rose-800'
              }`}
            >
              <strong>{m.correcta ? 'Correcto' : 'Revisar'}:</strong> {m.explicacion}
            </li>
          ))}
        </ul>
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

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-900/5 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {indice + 1} / {CRITERIOS_RAPIDOS.length}
        </span>
        <span className="text-xs text-slate-500">Arrastra: ← Falso · Verdadero →</span>
      </div>

      <div className="relative h-80 select-none">
        {siguienteCriterio && (
          <div className="absolute inset-0 bg-slate-50 ring-1 ring-slate-100 rounded-3xl p-6 scale-95 opacity-60 pointer-events-none">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Siguiente
            </p>
            <p className="text-sm text-slate-500 line-clamp-5">{siguienteCriterio.afirmacion}</p>
          </div>
        )}

        <motion.div
          key={criterio.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          style={{ x, rotate }}
          onDragEnd={onDragEnd}
          className="absolute inset-0 bg-white ring-1 ring-slate-200 rounded-3xl p-6 md:p-8 shadow-lg cursor-grab active:cursor-grabbing flex flex-col justify-between"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Afirmación · {criterio.norma}
            </p>
            <p className="text-lg md:text-xl font-semibold text-slate-900 leading-snug">
              {criterio.afirmacion}
            </p>
          </div>

          <motion.div
            style={{ opacity: opacityV }}
            className="absolute top-6 right-6 rotate-12 border-4 border-emerald-500 text-emerald-600 font-extrabold text-2xl px-4 py-1 rounded-xl"
          >
            VERDADERO
          </motion.div>
          <motion.div
            style={{ opacity: opacityF }}
            className="absolute top-6 left-6 -rotate-12 border-4 border-rose-500 text-rose-600 font-extrabold text-2xl px-4 py-1 rounded-xl"
          >
            FALSO
          </motion.div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => registrar(false)}
          className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-4 rounded-2xl transition"
        >
          <X className="w-5 h-5" /> Falso
        </button>
        <button
          type="button"
          onClick={() => registrar(true)}
          className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-4 rounded-2xl transition"
        >
          <Check className="w-5 h-5" /> Verdadero
        </button>
      </div>
    </div>
  );
}
