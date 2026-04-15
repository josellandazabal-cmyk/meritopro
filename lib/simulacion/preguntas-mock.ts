export interface PreguntaContrarreloj {
  id: string;
  enunciado: string;
  opciones: { clave: string; texto: string }[];
  correcta: string;
  norma: string;
}

export interface CriterioRapido {
  id: string;
  afirmacion: string;
  esVerdadero: boolean;
  norma: string;
  explicacion: string;
}

export const PREGUNTAS_CONTRARRELOJ: PreguntaContrarreloj[] = [
  {
    id: 'cr-1',
    enunciado: '¿Cuál es la vigencia de la lista de elegibles en el concurso PGN 2026?',
    opciones: [
      { clave: 'A', texto: '1 año' },
      { clave: 'B', texto: '2 años' },
      { clave: 'C', texto: '3 años' },
      { clave: 'D', texto: '4 años' },
    ],
    correcta: 'B',
    norma: 'Res. 76/2026 PGN, art. 14',
  },
  {
    id: 'cr-2',
    enunciado: 'El régimen especial de carrera de la PGN se rige por:',
    opciones: [
      { clave: 'A', texto: 'Ley 909 de 2004' },
      { clave: 'B', texto: 'Decreto Ley 262 de 2000' },
      { clave: 'C', texto: 'Decreto 1083 de 2015' },
      { clave: 'D', texto: 'Ley 1952 de 2019' },
    ],
    correcta: 'B',
    norma: 'Decreto Ley 262 de 2000',
  },
  {
    id: 'cr-3',
    enunciado: 'Para nivel Profesional, la ponderación de Conocimientos es:',
    opciones: [
      { clave: 'A', texto: '60%' },
      { clave: 'B', texto: '65%' },
      { clave: 'C', texto: '70%' },
      { clave: 'D', texto: '80%' },
    ],
    correcta: 'C',
    norma: 'Res. 76/2026 PGN',
  },
  {
    id: 'cr-4',
    enunciado: 'El puntaje mínimo aprobatorio de la prueba de conocimientos es:',
    opciones: [
      { clave: 'A', texto: '60/100' },
      { clave: 'B', texto: '65/100' },
      { clave: 'C', texto: '70/100' },
      { clave: 'D', texto: '75/100' },
    ],
    correcta: 'B',
    norma: 'Res. 76/2026 PGN',
  },
  {
    id: 'cr-5',
    enunciado: '¿Qué norma regula el ciclo vital del documento en entidades públicas?',
    opciones: [
      { clave: 'A', texto: 'Ley 1437 de 2011' },
      { clave: 'B', texto: 'Ley 594 de 2000' },
      { clave: 'C', texto: 'Ley 1755 de 2015' },
      { clave: 'D', texto: 'Ley 734 de 2002' },
    ],
    correcta: 'B',
    norma: 'Ley 594 de 2000',
  },
];

export const CRITERIOS_RAPIDOS: CriterioRapido[] = [
  {
    id: 'vr-1',
    afirmacion:
      'La experiencia profesional para el concurso PGN debe guardar similitud directa con el cargo al que aspira.',
    esVerdadero: true,
    norma: 'Res. 76/2026 PGN',
    explicacion:
      'Correcto. En la PGN "experiencia profesional" se entiende como experiencia relacionada: las funciones previas deben tener relación directa con las del cargo aspirado.',
  },
  {
    id: 'vr-2',
    afirmacion:
      'El concurso PGN 2026 es operado por la Comisión Nacional del Servicio Civil (CNSC).',
    esVerdadero: false,
    norma: 'Decreto Ley 262/2000',
    explicacion:
      'Falso. La PGN tiene régimen especial (Decreto Ley 262/2000), no se rige por CNSC. El operador oficial es la Universidad de Antioquia.',
  },
  {
    id: 'vr-3',
    afirmacion: 'La Ley 1952 de 2019 es el actual Código General Disciplinario.',
    esVerdadero: true,
    norma: 'Ley 1952 de 2019',
    explicacion:
      'Correcto. La Ley 1952 de 2019, modificada por la Ley 2094 de 2021, es el Código General Disciplinario vigente.',
  },
  {
    id: 'vr-4',
    afirmacion:
      'Para quedar en lista de elegibles basta con superar el 65/100 de la prueba de conocimientos.',
    esVerdadero: false,
    norma: 'Res. 76/2026 PGN',
    explicacion:
      'Falso. 65/100 es el mínimo aprobatorio de conocimientos, pero la lista de elegibles exige 70/100 en el puntaje ponderado global.',
  },
  {
    id: 'vr-5',
    afirmacion:
      'Las competencias comportamentales ponderan 20% en todos los niveles jerárquicos.',
    esVerdadero: true,
    norma: 'Res. 76/2026 PGN',
    explicacion:
      'Correcto. La prueba comportamental pondera 20% tanto para niveles Directivo/Asesor/Profesional como para Técnico/Administrativo/Operativo.',
  },
];
