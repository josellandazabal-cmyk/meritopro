'use client';

import { useState } from 'react';
import { Timer, Layers } from 'lucide-react';
import { PruebaContrarreloj } from '@/components/prueba-contrarreloj';
import { ValidacionRapida } from '@/components/validacion-rapida';

type Modo = 'contrarreloj' | 'validacion';

export default function SimulacionPage() {
  const [modo, setModo] = useState<Modo>('contrarreloj');

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
      <div className="space-y-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
          Centro de Simulación
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Entrena bajo las condiciones del concurso
        </h1>
        <p className="text-sm text-slate-600">
          Sesiones cortas, cronometradas, con retroalimentación normativa inmediata. El algoritmo
          SM-2 ajusta los intervalos de repaso según tu desempeño.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setModo('contrarreloj')}
          className={`rounded-2xl p-4 text-left ring-1 transition ${
            modo === 'contrarreloj'
              ? 'bg-yellow-400 ring-yellow-400 text-slate-900'
              : 'bg-white ring-slate-200 text-slate-700 hover:ring-yellow-400'
          }`}
        >
          <Timer className="w-5 h-5 mb-2" />
          <p className="text-sm font-bold">Prueba Contrarreloj</p>
          <p className="text-xs opacity-80 mt-1">15s por pregunta</p>
        </button>
        <button
          type="button"
          onClick={() => setModo('validacion')}
          className={`rounded-2xl p-4 text-left ring-1 transition ${
            modo === 'validacion'
              ? 'bg-yellow-400 ring-yellow-400 text-slate-900'
              : 'bg-white ring-slate-200 text-slate-700 hover:ring-yellow-400'
          }`}
        >
          <Layers className="w-5 h-5 mb-2" />
          <p className="text-sm font-bold">Validación Rápida</p>
          <p className="text-xs opacity-80 mt-1">Verdadero o Falso con swipe</p>
        </button>
      </div>

      {modo === 'contrarreloj' ? <PruebaContrarreloj /> : <ValidacionRapida />}
    </div>
  );
}
