"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryInput } from './salary-input';
import { FilterSection } from './filter-section';
import { SalaryChart } from './salary-chart';
import { DataTable } from './data-table';
import { FilterOptions, FilterType, SalaryData } from '@/lib/data/types';
import { 
  calculatePercentageBelow, 
  filterGroups, 
  generateSalaryDistribution, 
  getMedianSalary 
} from '@/lib/data/mock-data';

export function SalaryComparison() {
  // État pour les données de salaire
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [userSalary, setUserSalary] = useState<number | null>(null);
  const [percentageBelow, setPercentageBelow] = useState<number | null>(null);
  const [medianSalary, setMedianSalary] = useState<number>(0);
  
  // État pour les filtres
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sexe: 'ensemble',
    profession: 'ensemble',
    age: 'ensemble',
    activite: 'ensemble'
  });
  
  // Initialiser les données au chargement du composant
  useEffect(() => {
    const data = generateSalaryDistribution();
    setSalaryData(data);
    setMedianSalary(getMedianSalary(data));
  }, []);
  
  // Mettre à jour les données lorsque les filtres changent
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API ici avec les filtres
    // Pour cette démo, nous générons simplement de nouvelles données avec une légère variation
    const data = generateSalaryDistribution().map(item => {
      let multiplier = 1.0;
      
      // Appliquer des variations en fonction des filtres
      if (selectedFilters.sexe === 'femme') multiplier *= 0.85;
      if (selectedFilters.sexe === 'homme') multiplier *= 1.15;
      
      if (selectedFilters.profession === 'cadres') multiplier *= 1.8;
      if (selectedFilters.profession === 'professions_intermediaires') multiplier *= 1.2;
      if (selectedFilters.profession === 'employes') multiplier *= 0.9;
      if (selectedFilters.profession === 'ouvriers') multiplier *= 0.85;
      
      if (selectedFilters.age === 'moins_30') multiplier *= 0.8;
      if (selectedFilters.age === '30_39') multiplier *= 1.0;
      if (selectedFilters.age === '40_49') multiplier *= 1.1;
      if (selectedFilters.age === '50_plus') multiplier *= 1.2;
      
      if (selectedFilters.activite === 'industrie') multiplier *= 1.1;
      if (selectedFilters.activite === 'construction') multiplier *= 1.05;
      if (selectedFilters.activite === 'commerce') multiplier *= 0.95;
      if (selectedFilters.activite === 'services') multiplier *= 1.0;
      if (selectedFilters.activite === 'administration') multiplier *= 0.9;
      
      return {
        ...item,
        salaire: Math.round(item.salaire * multiplier)
      };
    });
    
    setSalaryData(data);
    setMedianSalary(getMedianSalary(data));
    
    // Recalculer le pourcentage si un salaire utilisateur est défini
    if (userSalary !== null) {
      setPercentageBelow(calculatePercentageBelow(data, userSalary));
    }
  }, [selectedFilters, userSalary]);
  
  // Gérer le changement de filtre
  const handleFilterChange = (type: FilterType, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Gérer le calcul du salaire
  const handleCalculate = (salary: number) => {
    setUserSalary(salary);
    setPercentageBelow(calculatePercentageBelow(salaryData, salary));
  };

  return (
    <div className="container mx-auto px-6 sm:px-8 py-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Combien de salariés gagnent plus ou moins que vous dans le secteur privé ?
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Colonne de gauche pour les filtres (1/4 de l'écran) */}
        <div className="md:col-span-1 space-y-6">
          <SalaryInput 
            onCalculate={handleCalculate} 
            percentageBelow={percentageBelow} 
          />
          <FilterSection 
            filterGroups={filterGroups} 
            selectedFilters={selectedFilters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Colonne de droite pour le graphique et le tableau (3/4 de l'écran) */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <Tabs defaultValue="chart" className="w-full">
              <div className="px-5 pt-5 border-b border-slate-200">
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="chart">Graphique</TabsTrigger>
                  <TabsTrigger value="data">Données</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-5">
                <TabsContent value="chart" className="mt-0 pt-0">
                  <SalaryChart 
                    data={salaryData} 
                    userSalary={userSalary} 
                    percentageBelow={percentageBelow} 
                  />
                </TabsContent>
                <TabsContent value="data" className="mt-0 pt-0">
                  <DataTable data={salaryData} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 