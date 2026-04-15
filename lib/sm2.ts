export interface SM2State {
  repetition: number;
  interval: number;
  efactor: number;
}

export interface SM2Review extends SM2State {
  proximaRevision: Date;
}

export const SM2_DEFAULT: SM2State = { repetition: 0, interval: 0, efactor: 2.5 };

export function calcularSM2(prev: SM2State, quality: number): SM2Review {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { repetition, interval, efactor } = prev;

  if (q < 3) {
    repetition = 0;
    interval = 1;
  } else {
    repetition += 1;
    if (repetition === 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.round(interval * efactor);
  }

  efactor = Math.max(1.3, efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const proximaRevision = new Date();
  proximaRevision.setDate(proximaRevision.getDate() + interval);

  return { repetition, interval, efactor, proximaRevision };
}

export function calidadDesdeRespuesta(args: {
  correcta: boolean;
  tiempoMs: number;
  limiteMs: number;
}): number {
  if (!args.correcta) return args.tiempoMs > args.limiteMs ? 0 : 2;
  const ratio = args.tiempoMs / args.limiteMs;
  if (ratio <= 0.33) return 5;
  if (ratio <= 0.66) return 4;
  return 3;
}
