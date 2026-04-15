export default function DiagnosticoDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
      <div className="space-y-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
          Mi Diagnóstico
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Tu radiografía frente al concurso
        </h1>
      </div>
      <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-3">
        <p className="text-sm text-slate-600">
          Aquí verás el detalle por módulo, tendencias semana a semana y los temas prioritarios
          que el Orquestador IA colocará en tu plan. Esta vista se activa en el Paso 7 del
          roadmap.
        </p>
      </section>
    </div>
  );
}
