'use server';

import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type {
  PreguntaDiagnostico,
  RespuestaUsuario,
  ResumenModulo,
} from '@/types/diagnostico';

interface SubmitInput {
  leadId: string;
  respuestas: RespuestaUsuario[];
}

export async function submitDiagnostic({ leadId, respuestas }: SubmitInput) {
  const supabase = getSupabaseServerClient();

  const ids = respuestas.map((r) => r.pregunta_id);
  const { data: preguntas, error: qErr } = await supabase
    .from('questions')
    .select('id, tipo_pregunta, modulo, tema, respuesta_correcta')
    .in('id', ids);

  if (qErr || !preguntas) {
    throw new Error('No se pudieron cargar las preguntas para calificar.');
  }

  const mapPreguntas = new Map(preguntas.map((p) => [p.id as string, p]));
  const porModulo = new Map<string, ResumenModulo>();
  let correctas = 0;

  for (const r of respuestas) {
    const p = mapPreguntas.get(r.pregunta_id);
    if (!p) continue;

    const correcta = String(p.respuesta_correcta).replace(/^"|"$/g, '');
    const acerto = r.clave_elegida === correcta;
    if (acerto) correctas += 1;

    const key = p.modulo as string;
    const prev = porModulo.get(key) ?? {
      modulo_clave: key,
      total: 0,
      correctas: 0,
      tasa_acierto: 0,
    };
    prev.total += 1;
    if (acerto) prev.correctas += 1;
    prev.tasa_acierto = prev.correctas / prev.total;
    porModulo.set(key, prev);
  }

  const modulos = Array.from(porModulo.values());
  const total = respuestas.length || 1;
  const indice = Math.round((correctas / total) * 100 * 100) / 100;

  const ordenados = [...modulos].sort((a, b) => b.tasa_acierto - a.tasa_acierto);
  const moduloFuerte = ordenados[0]?.modulo_clave ?? null;
  const moduloDebil = ordenados[ordenados.length - 1]?.modulo_clave ?? null;

  const temasDebiles = respuestas
    .filter((r) => {
      const p = mapPreguntas.get(r.pregunta_id);
      if (!p) return false;
      const correcta = String(p.respuesta_correcta).replace(/^"|"$/g, '');
      return r.clave_elegida !== correcta;
    })
    .map((r) => {
      const p = mapPreguntas.get(r.pregunta_id)!;
      return { tema: p.tema as string, modulo: p.modulo as string };
    });

  const { data: inserted, error: dErr } = await supabase
    .from('diagnostics')
    .insert({
      lead_id: leadId,
      indice_preparacion: indice,
      modulo_mas_fuerte: moduloFuerte,
      modulo_mas_debil: moduloDebil,
      modulos_json: modulos,
      temas_debiles_json: temasDebiles,
      temas_prioritarios: temasDebiles.slice(0, 5).map((t) => t.tema),
    })
    .select('id')
    .single();

  if (dErr || !inserted) {
    throw new Error(dErr?.message ?? 'No se pudo guardar el diagnóstico.');
  }

  await supabase
    .from('leads')
    .update({ diagnostico_id: inserted.id })
    .eq('id', leadId);

  redirect(`/diagnostico/resultado/${inserted.id}`);
}

export async function fetchPreguntasActivas(): Promise<PreguntaDiagnostico[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, tipo_pregunta, modulo, tema, enunciado, opciones_json, respuesta_correcta, explicacion, norma_relacionada, dificultad'
    )
    .eq('activa', true)
    .order('tipo_pregunta', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...row,
    respuesta_correcta: String(row.respuesta_correcta).replace(/^"|"$/g, ''),
  })) as PreguntaDiagnostico[];
}
