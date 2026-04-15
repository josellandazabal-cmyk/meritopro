'use server';

import { getSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

interface CheckoutInput {
  leadId: string;
  diagnosticoId: string;
}

export async function iniciarCheckout({ leadId, diagnosticoId }: CheckoutInput): Promise<void> {
  const admin = getSupabaseAdminClient();

  const { data: lead, error: lErr } = await admin
    .from('leads')
    .select('email, nombre')
    .eq('id', leadId)
    .single();

  if (lErr || !lead) {
    throw new Error('No se encontró el lead para iniciar el pago.');
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const redirectTo = `${siteUrl}/auth/callback?lead_id=${leadId}&diagnostico_id=${diagnosticoId}`;

  const supabase = getSupabaseSSRClient();
  const { error: otpErr } = await supabase.auth.signInWithOtp({
    email: lead.email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
      data: { nombre: lead.nombre, lead_id: leadId },
    },
  });

  if (otpErr) {
    throw new Error(`No se pudo enviar el Magic Link: ${otpErr.message}`);
  }
}
