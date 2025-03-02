"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryInput } from './salary-input';
import { FilterSection } from './filter-section';
import { SalaryChart } from './salary-chart';
import { DataTable } from './data-table';
import { FilterOptions, FilterType, SalaryData } from '@/lib/data/types';
import { filterGroups } from '@/lib/data/mock-data'; // Nous gardons les groupes de filtres
import { 
  fetchSalaryData,
  calculatePercentageBelow, 
  getMedianSalary,
  applyFilters
} from '@/lib/data/supabase-data';

export function SalaryComparison() {
  // État pour les données de salaire
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [userSalary, setUserSalary] = useState<number | null>(null);
  const [percentageBelow, setPercentageBelow] = useState<number | null>(null);
  const [medianSalary, setMedianSalary] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour les filtres
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sexe: 'ensemble',
    profession: 'ensemble',
    age: 'ensemble',
    activite: 'ensemble'
  });
  
  // Charger les données de base depuis Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSalaryData();
        
        if (data.length === 0) {
          setError("Aucune donnée trouvée dans la base de données.");
          return;
        }
        
        setSalaryData(data);
        setMedianSalary(getMedianSalary(data));
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors du chargement des données:", err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Appliquer les filtres lorsque l'utilisateur change ses sélections
  useEffect(() => {
    if (salaryData.length === 0) return;
    
    // Appliquer les filtres aux données de base
    const filteredData = applyFilters(salaryData, selectedFilters);
    setSalaryData(filteredData);
    setMedianSalary(getMedianSalary(filteredData));
    
    // Recalculer le pourcentage si un salaire utilisateur est défini
    if (userSalary !== null) {
      setPercentageBelow(calculatePercentageBelow(filteredData, userSalary));
    }
  }, [selectedFilters]);
  
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

  // Afficher un message de chargement ou d'erreur si nécessaire
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 sm:px-8 py-6 text-center">
        <p className="text-lg">Chargement des données de salaires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 sm:px-8 py-6">
        <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Erreur</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Vérifiez que votre table Supabase contient des données et que la connexion est correctement configurée.
          </p>
        </div>
      </div>
    );
  }

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