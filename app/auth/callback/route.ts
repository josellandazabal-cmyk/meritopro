import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const leadId = url.searchParams.get('lead_id');
  const diagnosticoId = url.searchParams.get('diagnostico_id');
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth_error=missing_code`);
  }

  const supabase = getSupabaseSSRClient();
  const { data: session, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session.user) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error?.message ?? 'unknown')}`);
  }

  const userId = session.user.id;

  if (leadId && diagnosticoId) {
    const admin = getSupabaseAdminClient();

    await admin
      .from('diagnostics')
      .update({ user_id: userId })
      .eq('id', diagnosticoId)
      .is('user_id', null);

    await admin
      .from('leads')
      .update({ convertido: true, diagnostico_id: diagnosticoId })
      .eq('id', leadId);

    const { data: lead } = await admin
      .from('leads')
      .select('profesion, cargo_aspirado')
      .eq('id', leadId)
      .single();

    await admin.from('profiles').upsert(
      {
        id: userId,
        lead_id: leadId,
        profesion: lead?.profesion ?? 'pendiente',
        opec_seleccionada: 'pendiente',
        nivel_cargo: nivelFromLead(lead?.cargo_aspirado),
        linea_base_diagnostico_id: diagnosticoId,
      },
      { onConflict: 'id' }
    );
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}

function nivelFromLead(cargo: string | undefined | null): string {
  switch (cargo) {
    case 'profesional':
      return 'profesional';
    case 'tecnico':
      return 'tecnico';
    case 'asistencial':
      return 'administrativo';
    default:
      return 'profesional';
  }
}
