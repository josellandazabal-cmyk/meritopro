import { getSupabaseSSRClient } from '@/lib/supabase/ssr';

export default async function PerfilPage() {
  const supabase = getSupabaseSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('profesion, nivel_cargo, opec_seleccionada')
    .eq('id', user!.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-6">
      <div className="space-y-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-500">
          Mi Perfil
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Tu ficha de aspirante
        </h1>
      </div>
      <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-900/5 space-y-3">
        <p className="text-sm text-slate-700">
          Correo: <strong>{user!.email}</strong>
        </p>
        <p className="text-sm text-slate-700">
          Profesión: <strong>{profile?.profesion ?? 'pendiente'}</strong>
        </p>
        <p className="text-sm text-slate-700">
          Nivel de cargo: <strong>{profile?.nivel_cargo ?? 'pendiente'}</strong>
        </p>
        <p className="text-sm text-slate-700">
          OPEC seleccionada: <strong>{profile?.opec_seleccionada ?? 'pendiente'}</strong>
        </p>
      </section>
    </div>
  );
}
