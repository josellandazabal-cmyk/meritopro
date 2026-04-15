import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';

interface PageProps {
  searchParams: { lead_id?: string; diagnostico_id?: string };
}

export default function CheckoutPage({ searchParams }: PageProps) {
  const leadId = searchParams.lead_id;
  const diagnosticoId = searchParams.diagnostico_id;

  if (!leadId || !diagnosticoId) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-4 shadow-xl shadow-slate-900/5">
          <h1 className="text-2xl font-semibold text-slate-900">Faltan datos del pedido</h1>
          <p className="text-sm text-slate-500">
            Completa primero el diagnóstico gratuito para generar tu pedido.
          </p>
          <Link
            href="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-3 rounded-2xl transition"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
            Checkout · Pase Integral
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Confirma tu acceso a MéritoPro
          </h1>
        </div>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Pase Integral PGN 2026</p>
              <p className="text-xs text-slate-500 mt-1">
                Acceso ilimitado hasta la fecha del concurso.
              </p>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              $197.000 <span className="text-sm font-semibold text-slate-500">COP</span>
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3 text-sm text-slate-700">
            <p className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Plan personalizado ajustado a tu diagnóstico.
            </p>
            <p className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Banco completo de preguntas Tipo I, II y III.
            </p>
            <p className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              Tutor virtual con IA especializado en Decreto Ley 262/2000.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Modo simulación
            </p>
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">
              En esta iteración el cobro está simulado.
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Al confirmar, enviaremos un <strong>Magic Link</strong> al correo que registraste.
              Al hacer clic en el enlace, tu diagnóstico quedará como <em>línea base</em> y se
              vinculará a tu cuenta de usuario.
            </p>
          </div>
          <CheckoutButton leadId={leadId} diagnosticoId={diagnosticoId} />
          <p className="text-xs text-slate-500 text-center">
            Revisa tu bandeja de entrada (y spam). El enlace expira en 60 minutos.
          </p>
        </section>

        <div className="text-center pt-2">
          <Link
            href={`/diagnostico/resultado/${diagnosticoId}`}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Volver a los resultados
          </Link>
        </div>
      </div>
    </main>
  );
}
