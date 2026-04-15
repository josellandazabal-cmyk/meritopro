'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type NivelAspirado = 'profesional' | 'tecnico' | 'asistencial';

const NIVELES: { value: NivelAspirado; label: string }[] = [
  { value: 'profesional', label: 'Profesional (Directivo / Asesor / Profesional)' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'asistencial', label: 'Asistencial (Administrativo / Operativo)' },
];

export function LeadForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState<NivelAspirado | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !email.trim() || !nivel) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          cargo_aspirado: nivel,
          fuente: 'landing',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!data?.id) throw new Error('No se pudo registrar el lead.');

      router.push(`/diagnostico?lead_id=${data.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido.';
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-6"
    >
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
          Descubre tu nivel real de preparación
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Responde 40 preguntas en 30 minutos. Te diremos exactamente dónde estás débil.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition disabled:opacity-60"
            placeholder="Ej. María Fernanda Gómez"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition disabled:opacity-60"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label htmlFor="nivel" className="block text-sm font-medium text-slate-700 mb-2">
            Nivel al que aspiras
          </label>
          <select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value as NivelAspirado)}
            disabled={loading}
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition disabled:opacity-60"
          >
            <option value="" disabled>
              Selecciona un nivel
            </option>
            {NIVELES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold text-base md:text-lg py-4 md:py-5 rounded-2xl shadow-lg shadow-yellow-400/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Preparando tu diagnóstico...' : 'Tomar Diagnóstico Gratuito de 40 Preguntas'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Sin tarjeta. Sin registro. Resultados inmediatos.
      </p>
    </form>
  );
}
