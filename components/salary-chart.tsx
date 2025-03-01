"use client";

import { SalaryData } from '@/lib/data/types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  ReferenceArea,
  Label
} from 'recharts';

interface SalaryChartProps {
  data: SalaryData[];
  userSalary: number | null;
  percentageBelow: number | null;
}

export function SalaryChart({ data, userSalary, percentageBelow }: SalaryChartProps) {
  // Formatter pour afficher les valeurs en euros
  const euroFormatter = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} €`;
  
  // Formatter pour les centiles
  const centileFormatter = (value: number) => {
    if (value === 10) return '10%';
    if (value === 25) return '25%';
    if (value === 50) return '50% (médiane)';
    if (value === 75) return '75%';
    if (value === 90) return '90%';
    return `${value}%`;
  };
  
  // Trouver les indices des centiles
  const getIndicesForCentiles = () => {
    const indices = [];
    for (let i = 0; i < data.length; i++) {
      const centile = data[i].centile;
      if ([10, 25, 50, 75, 90].includes(centile)) {
        indices.push(i);
      }
    }
    return indices;
  };
  
  // Création des ticks personnalisés pour l'axe X
  const customTicks = getIndicesForCentiles().map(index => data[index].centile);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-700">Distribution des salaires</h3>
        {userSalary !== null && percentageBelow !== null && (
          <div className="text-sm text-slate-500">
            <span className="font-medium text-blue-600">{euroFormatter(userSalary)}</span> est supérieur à <span className="font-medium text-blue-600">{percentageBelow.toFixed(1)}%</span> des salaires
          </div>
        )}
      </div>
      
      <div className="w-full" style={{ height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="centile" 
              label={{ 
                value: 'Centile', 
                position: 'insideBottomRight', 
                offset: -15 
              }}
              ticks={customTicks}
              tickFormatter={centileFormatter}
            />
            <YAxis 
              tickFormatter={euroFormatter}
              label={{ 
                value: 'Salaire mensuel net (€)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [euroFormatter(value), 'Salaire']}
              labelFormatter={(value: number) => `Centile ${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="salaire" 
              stroke="#0369a1" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />
            
            {userSalary !== null && (
              <>
                <ReferenceLine 
                  y={userSalary} 
                  stroke="#059669" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                >
                  <Label 
                    position="right" 
                    value={euroFormatter(userSalary)} 
                    fill="#059669"
                    fontSize={12}
                  />
                </ReferenceLine>
                
                {percentageBelow !== null && (
                  <ReferenceArea 
                    x1={0} 
                    x2={percentageBelow} 
                    y1={0}
                    y2={userSalary}
                    fill="#10b981"
                    fillOpacity={0.1}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 