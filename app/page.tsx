import { LeadForm } from '@/components/lead-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="px-6 py-5 md:px-10 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden className="inline-block w-8 h-8 rounded-xl bg-yellow-400" />
          <span className="text-lg font-bold tracking-tight">MéritoPro</span>
        </div>
        <span className="hidden md:inline text-xs font-medium text-slate-500">
          Concurso PGN · Convocatoria 2026
        </span>
      </header>

      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-6 md:pt-16 pb-20 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div className="space-y-6 md:pt-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500 bg-white rounded-full px-4 py-2">
            Procuraduría General de la Nación · 2.826 vacantes
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
            Asegura tu plaza en la Procuraduría.
            <span className="block text-slate-500 mt-3">
              El 80% fracasa por estudiar mal.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
            MéritoPro te dice honestamente dónde estás débil, te prepara con la metodología
            oficial del concurso y maximiza tu puntaje en conocimientos, comportamentales y
            antecedentes.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 max-w-md">
            <div className="bg-white rounded-2xl p-4">
              <p className="text-2xl font-semibold text-slate-900">2 años</p>
              <p className="text-xs text-slate-500 mt-1">Vigencia de la lista de elegibles</p>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <p className="text-2xl font-semibold text-slate-900">65 / 100</p>
              <p className="text-xs text-slate-500 mt-1">Puntaje mínimo aprobatorio</p>
            </div>
          </div>
        </div>

        <div className="md:sticky md:top-6">
          <LeadForm />
        </div>
      </section>

      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          Las cuatro promesas
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              t: 'Conoce tu nivel real',
              d: 'Diagnóstico continuo por módulo y tipo de pregunta.',
            },
            {
              t: 'Estudia lo que el concurso evalúa',
              d: 'Temario alineado al Núcleo Común y Específico de la PGN.',
            },
            {
              t: 'Practica con la metodología oficial',
              d: 'Preguntas Tipo I, II y III + escala Likert comportamental.',
            },
            {
              t: 'Optimiza tus antecedentes',
              d: 'Calculadora de puntaje por estudios y experiencia.',
            },
          ].map((p) => (
            <div key={p.t} className="bg-white rounded-3xl p-6">
              <p className="font-semibold text-slate-900">{p.t}</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-10 max-w-6xl mx-auto pb-10 text-xs text-slate-400">
        Operador oficial: Universidad de Antioquia · Régimen especial Decreto Ley 262/2000
      </footer>
    </main>
  );
}
