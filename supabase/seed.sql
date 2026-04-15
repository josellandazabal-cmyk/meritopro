-- MéritoPro — Seed inicial (preguntas de muestra PGN)
-- Se ejecuta después de migrations. 3 ítems: disciplinario, constitucional, comportamental.

insert into public.questions
  (tipo_pregunta, modulo, tema, enunciado, opciones_json, respuesta_correcta, explicacion, norma_relacionada, dificultad)
values
-- ============================================================
-- 1. TIPO I — Derecho Disciplinario (Ley 1952 de 2019)
-- ============================================================
(
  'tipo_I',
  'eje_disciplinario',
  'Sanciones disciplinarias — dosificación',
  'De acuerdo con el Código General Disciplinario, cuando la falta disciplinaria se califica como gravísima y se realiza a título de dolo, la sanción principal aplicable al servidor público es:',
  '[
    {"clave":"A","texto":"Multa equivalente a diez (10) días del salario devengado."},
    {"clave":"B","texto":"Destitución e inhabilidad general para ejercer cargos públicos."},
    {"clave":"C","texto":"Suspensión en el ejercicio del cargo entre uno (1) y doce (12) meses."},
    {"clave":"D","texto":"Amonestación escrita con copia a la hoja de vida."}
  ]'::jsonb,
  '"B"'::jsonb,
  'Conforme al artículo 48 de la Ley 1952 de 2019, las faltas gravísimas realizadas con dolo o culpa gravísima conllevan la sanción de destitución e inhabilidad general. La inhabilidad general oscila entre diez (10) y veinte (20) años.',
  'Art. 48 Ley 1952 de 2019 — Código General Disciplinario',
  2
),
-- ============================================================
-- 2. TIPO III — Derecho Constitucional (Acción de Tutela)
-- ============================================================
(
  'tipo_III',
  'eje_constitucional_ddhh',
  'Acción de tutela — procedencia contra particulares',
  'Afirmación: La acción de tutela procede contra actos u omisiones de particulares encargados de la prestación de servicios públicos, PORQUE en esos casos el particular se encuentra en situación de indefensión frente al accionante y la Constitución autoriza excepcionalmente su procedencia contra particulares.',
  '[
    {"clave":"A","texto":"La afirmación es verdadera, la razón es verdadera y la razón explica la afirmación."},
    {"clave":"B","texto":"La afirmación es verdadera, la razón es verdadera pero la razón NO explica la afirmación."},
    {"clave":"C","texto":"La afirmación es verdadera y la razón es falsa."},
    {"clave":"D","texto":"La afirmación es falsa y la razón es verdadera."},
    {"clave":"E","texto":"Tanto la afirmación como la razón son falsas."}
  ]'::jsonb,
  '"A"'::jsonb,
  'El artículo 86 de la Constitución Política establece que la tutela procede contra particulares encargados de la prestación de un servicio público, o cuyo comportamiento afecte grave y directamente el interés colectivo, o respecto de quienes el solicitante se halle en estado de subordinación o indefensión. Esa fundamentación constitucional es exactamente lo que la razón explica.',
  'Art. 86 Constitución Política 1991 · Decreto 2591 de 1991',
  3
),
-- ============================================================
-- 3. COMPORTAMENTAL — Orientación al ciudadano (Likert frecuencia)
-- ============================================================
(
  'comportamental',
  'competencia_orientacion_ciudadano',
  'Orientación al ciudadano',
  'En situaciones donde un ciudadano expresa molestia por la demora en el trámite de su petición, yo mantengo la calma, escucho activamente sus inquietudes y le explico con claridad los términos legales del procedimiento.',
  '[
    {"clave":"1","texto":"Nunca"},
    {"clave":"2","texto":"Rara vez"},
    {"clave":"3","texto":"Ocasionalmente"},
    {"clave":"4","texto":"Frecuentemente"},
    {"clave":"5","texto":"Siempre"}
  ]'::jsonb,
  '"5"'::jsonb,
  'Ítem Likert de frecuencia, sección A (conducta positiva). La puntuación suma directamente al indicador de la competencia "Orientación al ciudadano". Conducta esperada para todos los niveles jerárquicos según el marco de competencias transversales de la PGN.',
  'Marco de Competencias Transversales — PGN · Decreto Ley 262/2000',
  1
);
