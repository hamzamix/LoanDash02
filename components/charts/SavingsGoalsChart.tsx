import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Savings } from '../../types.ts';
import { formatCurrency } from '../../utils/formatters.ts';

interface SavingsGoalsChartProps {
  savings: Savings[];
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

const SavingsGoalsChart: React.FC<SavingsGoalsChartProps> = ({ savings }) => {
  const chartData = useMemo(() => {
    return savings
      .map(saving => ({
        name: saving.name,
        value: saving.currentAmount,
      }))
      .filter(s => s.value > 0);
  }, [savings]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800 rounded-lg p-4">
        <p className="text-slate-400 text-center">No savings data to display. Add a goal to get started!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderColor: '#475569',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#cbd5e1' }}
        />
        <Legend iconType="circle" />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SavingsGoalsChart;