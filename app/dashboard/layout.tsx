import { redirect } from 'next/navigation';
import { getSupabaseSSRClient } from '@/lib/supabase/ssr';
import { DashboardSidebar, DashboardBottomNav } from '@/components/dashboard-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="md:pl-64">
        <main className="pb-24 md:pb-12">{children}</main>
      </div>
      <DashboardBottomNav />
    </div>
  );
}
