export type TipoPregunta = 'tipo_I' | 'tipo_II' | 'tipo_III' | 'comportamental';

export interface OpcionRespuesta {
  clave: string;
  texto: string;
}

export interface PreguntaDiagnostico {
  id: string;
  tipo_pregunta: TipoPregunta;
  modulo: string;
  tema: string;
  enunciado: string;
  opciones_json: OpcionRespuesta[];
  respuesta_correcta: string;
  explicacion: string;
  norma_relacionada: string;
  dificultad: 1 | 2 | 3;
}

export interface RespuestaUsuario {
  pregunta_id: string;
  clave_elegida: string;
}

export interface ResumenModulo {
  modulo_clave: string;
  total: number;
  correctas: number;
  tasa_acierto: number;
}
