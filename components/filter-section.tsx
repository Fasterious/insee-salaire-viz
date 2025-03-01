"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterGroup, FilterOptions, FilterType } from '@/lib/data/types';

interface FilterSectionProps {
  filterGroups: FilterGroup[];
  selectedFilters: FilterOptions;
  onFilterChange: (type: FilterType, value: string) => void;
}

export function FilterSection({ filterGroups, selectedFilters, onFilterChange }: FilterSectionProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2 px-5">
        <CardTitle className="text-lg font-medium text-slate-700">Filtrer par population</CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <div className="grid grid-cols-1 gap-4">
          {filterGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <label htmlFor={`filter-${group.id}`} className="text-sm font-medium text-slate-600">
                {group.label}
              </label>
              <Select
                value={selectedFilters[group.id]}
                onValueChange={(value) => onFilterChange(group.id, value)}
              >
                <SelectTrigger id={`filter-${group.id}`} className="bg-white">
                  <SelectValue placeholder={`Sélectionner ${group.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {group.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 