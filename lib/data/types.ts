export interface SalaryData {
  centile: number;
  salaire: number;
}

export interface SalaryDistribution {
  data: SalaryData[];
  median: number;
  userSalary: number | null;
  percentageBelow: number | null;
}

export interface FilterOptions {
  sexe: string;
  profession: string;
  age: string;
  activite: string;
}

export type FilterType = 'sexe' | 'profession' | 'age' | 'activite';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  id: FilterType;
  label: string;
  options: FilterOption[];
} 