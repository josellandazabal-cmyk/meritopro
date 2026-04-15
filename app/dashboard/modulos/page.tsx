export default function ModulosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
      <div className="space-y-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
          Módulos de Estudio
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Banco de preguntas y ejes específicos
        </h1>
      </div>
      <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-3">
        <p className="text-sm text-slate-600">
          Aquí se listarán los módulos del Núcleo Común y los ejes específicos asignados a tu
          perfil OPEC. Se habilita en el Paso 8 del roadmap.
        </p>
      </section>
    </div>
  );
}
