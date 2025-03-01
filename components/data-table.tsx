"use client";

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SalaryData } from '@/lib/data/types';
import { Download } from 'lucide-react';

interface DataTableProps {
  data: SalaryData[];
}

export function DataTable({ data }: DataTableProps) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const handleExportCSV = () => {
    const headers = ['Centile', 'Salaire'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => `${item.centile},${item.salaire}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'distribution_salaires.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'distribution_salaires.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-700">Tableau des valeurs</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportJSON}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Centile</TableHead>
              <TableHead className="text-right">Salaire mensuel net (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.map((item) => (
              <TableRow key={item.centile}>
                <TableCell>{item.centile}%</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('fr-FR').format(item.salaire)} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center text-sm text-slate-500">
        <div>
          Affichage de {startIndex + 1} à {Math.min(endIndex, data.length)} sur {data.length} valeurs
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
} 