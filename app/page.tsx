import { Header } from '@/components/header';
import { SalaryComparison } from '@/components/salary-comparison';
import SupabaseClient from '@/components/SupabaseClient';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <SalaryComparison />
      
      {/* Section pour l'exemple Supabase */}
      <section className="container mx-auto p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Connexion à Supabase</h2>
        <SupabaseClient />
      </section>
    </main>
  );
}
