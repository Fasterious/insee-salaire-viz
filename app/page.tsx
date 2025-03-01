import { Header } from '@/components/header';
import { SalaryComparison } from '@/components/salary-comparison';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <SalaryComparison />
    </main>
  );
}
