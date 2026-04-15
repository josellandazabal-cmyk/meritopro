'use client';

import { useState, useTransition } from 'react';
import { iniciarCheckout } from '@/app/checkout/actions';

interface Props {
  leadId: string;
  diagnosticoId: string;
}

export function CheckoutButton({ leadId, diagnosticoId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function confirmar() {
    setError(null);
    startTransition(async () => {
      try {
        await iniciarCheckout({ leadId, diagnosticoId });
        setEnviado(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al procesar el pago.');
      }
    });
  }

  if (enviado) {
    return (
      <div className="bg-emerald-50 ring-1 ring-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-sm font-semibold text-emerald-700">
          Te enviamos el Magic Link al correo registrado.
        </p>
        <p className="text-xs text-emerald-700/80 mt-1">
          Haz clic en el enlace para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={confirmar}
        disabled={isPending}
        className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold text-base md:text-lg py-5 rounded-2xl shadow-lg shadow-yellow-400/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Procesando…' : 'Confirmar pago simulado — $197.000 COP'}
      </button>
      {error && (
        <div className="bg-rose-50 text-rose-700 text-sm rounded-2xl px-5 py-4">{error}</div>
      )}
    </div>
  );
}
