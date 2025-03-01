"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SalaryInputProps {
  onCalculate: (salary: number) => void;
  percentageBelow: number | null;
}

export function SalaryInput({ onCalculate, percentageBelow }: SalaryInputProps) {
  const [salary, setSalary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const salaryValue = parseFloat(salary.replace(/\s+/g, '').replace(',', '.'));
    
    if (isNaN(salaryValue) || salaryValue <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }
    
    setError(null);
    onCalculate(salaryValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2 px-5">
        <CardTitle className="text-lg font-medium text-slate-700">Entrez votre salaire mensuel net*</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          * net à payer avant impôt sur le revenu, en équivalent temps plein
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: 2500"
              className="flex-1 bg-white"
              aria-label="Salaire mensuel net"
            />
            <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700">Calculer</Button>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {percentageBelow !== null && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <p className="font-medium text-slate-800">
                Avec {new Intl.NumberFormat('fr-FR').format(parseFloat(salary))} euros, {percentageBelow.toFixed(1)}% des salariés gagnent moins que vous.
              </p>
            </div>
          )}
          
          <div className="mt-2 text-xs text-slate-500">
            <p>
              Le salaire en équivalent temps plein (EQTP) correspond au salaire converti à un temps plein quel que soit le volume de
              travail effectif. Si par exemple vous travaillez à mi-temps (50 %) pour un salaire mensuel de 1 000 €, il vous faut renseigner
              le salaire que vous percevriez en travaillant à temps plein, soit 2 000€ (=1 000 €/0,5).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 