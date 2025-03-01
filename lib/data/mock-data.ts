import { FilterGroup, SalaryData } from './types';

// Données de distribution des salaires (centiles)
export const generateSalaryDistribution = (): SalaryData[] => {
  const data: SalaryData[] = [];
  
  // Générer des données pour chaque centile (1-100)
  for (let i = 1; i <= 100; i++) {
    let salaire: number;
    
    // Simulation d'une distribution réaliste des salaires
    if (i < 10) {
      // Les 10% les plus bas
      salaire = 1200 + (i * 50);
    } else if (i < 50) {
      // De 10% à 50%
      salaire = 1700 + ((i - 10) * 30);
    } else if (i < 90) {
      // De 50% à 90%
      salaire = 2900 + ((i - 50) * 70);
    } else {
      // Les 10% les plus élevés (croissance exponentielle)
      salaire = 5700 + ((i - 90) ** 2 * 100);
    }
    
    data.push({
      centile: i,
      salaire: Math.round(salaire)
    });
  }
  
  return data;
};

// Options de filtres
export const filterGroups: FilterGroup[] = [
  {
    id: 'sexe',
    label: 'Sexe',
    options: [
      { id: 'ensemble', label: 'Ensemble' },
      { id: 'homme', label: 'Homme' },
      { id: 'femme', label: 'Femme' }
    ]
  },
  {
    id: 'profession',
    label: 'Professions',
    options: [
      { id: 'ensemble', label: 'Ensemble' },
      { id: 'cadres', label: 'Cadres' },
      { id: 'professions_intermediaires', label: 'Professions intermédiaires' },
      { id: 'employes', label: 'Employés' },
      { id: 'ouvriers', label: 'Ouvriers' }
    ]
  },
  {
    id: 'age',
    label: 'Âge',
    options: [
      { id: 'ensemble', label: 'Ensemble' },
      { id: 'moins_30', label: 'Moins de 30 ans' },
      { id: '30_39', label: '30 à 39 ans' },
      { id: '40_49', label: '40 à 49 ans' },
      { id: '50_plus', label: '50 ans ou plus' }
    ]
  },
  {
    id: 'activite',
    label: 'Activité économique',
    options: [
      { id: 'ensemble', label: 'Ensemble' },
      { id: 'industrie', label: 'Industrie' },
      { id: 'construction', label: 'Construction' },
      { id: 'commerce', label: 'Commerce' },
      { id: 'services', label: 'Services' },
      { id: 'administration', label: 'Administration publique' }
    ]
  }
];

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