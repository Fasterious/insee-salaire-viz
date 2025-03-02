import { supabase } from '@/lib/supabase';
import { SalaryData, FilterOptions } from './types';

// Récupérer les données de salaire depuis Supabase
export const fetchSalaryData = async (): Promise<SalaryData[]> => {
  const { data, error } = await supabase
    .from('salary_centiles')
    .select('*')
    .order('centile', { ascending: true });

  if (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }

  // Mapper les données au format attendu par l'application
  return (data || []).map(item => ({
    centile: item.centile,
    salaire: item.salary_value
  }));
};

// Fonction pour calculer le pourcentage de personnes gagnant moins qu'un salaire donné
export const calculatePercentageBelow = (data: SalaryData[], salary: number): number => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].salaire >= salary) {
      // Interpolation linéaire pour obtenir une estimation plus précise
      if (i === 0) return 0;
      
      const lowerCentile = data[i-1];
      const upperCentile = data[i];
      
      const ratio = (salary - lowerCentile.salaire) / (upperCentile.salaire - lowerCentile.salaire);
      return lowerCentile.centile + ratio;
    }
  }
  
  return 100; // Si le salaire est supérieur à tous les centiles
};

// Fonction pour obtenir la médiane des salaires
export const getMedianSalary = (data: SalaryData[]): number => {
  const medianData = data.find(item => item.centile === 50);
  return medianData ? medianData.salaire : 0;
};

// Pour maintenir la compatibilité avec la version simulée actuelle
// Cette fonction sera idéalement remplacée par des appels à différentes tables ou filtres Supabase
export const applyFilters = (data: SalaryData[], filters: FilterOptions): SalaryData[] => {
  // Si nous n'avons pas de données filtrées dans Supabase, nous appliquons des facteurs simulés
  // temporairement pour maintenir les fonctionnalités existantes
  let multiplier = 1.0;
  
  // Appliquer des variations en fonction des filtres (simulation)
  if (filters.sexe === 'femme') multiplier *= 0.85;
  if (filters.sexe === 'homme') multiplier *= 1.15;
  
  if (filters.profession === 'cadres') multiplier *= 1.8;
  if (filters.profession === 'professions_intermediaires') multiplier *= 1.2;
  if (filters.profession === 'employes') multiplier *= 0.9;
  if (filters.profession === 'ouvriers') multiplier *= 0.85;
  
  if (filters.age === 'moins_30') multiplier *= 0.8;
  if (filters.age === '30_39') multiplier *= 1.0;
  if (filters.age === '40_49') multiplier *= 1.1;
  if (filters.age === '50_plus') multiplier *= 1.2;
  
  if (filters.activite === 'industrie') multiplier *= 1.1;
  if (filters.activite === 'construction') multiplier *= 1.05;
  if (filters.activite === 'commerce') multiplier *= 0.95;
  if (filters.activite === 'services') multiplier *= 1.0;
  if (filters.activite === 'administration') multiplier *= 0.9;
  
  return data.map(item => ({
    centile: item.centile,
    salaire: Math.round(item.salaire * multiplier)
  }));
}; 