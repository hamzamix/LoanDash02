import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Loan, LoanDirection } from '../../types.ts';
import { formatCurrency } from '../../utils/formatters.ts';

interface DebtBreakdownChartProps {
  debts: Loan[];
}

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

const DebtBreakdownChart: React.FC<DebtBreakdownChartProps> = ({ debts }) => {
  const chartData = useMemo(() => {
    return debts
      .filter(debt => debt.direction === LoanDirection.IOwe)
      .map(debt => {
        const totalPaid = debt.payments.reduce((acc, p) => acc + p.amount, 0);
        const remaining = debt.totalAmount - totalPaid;
        return {
          name: debt.name,
          value: remaining,
        };
      })
      .filter(d => d.value > 0);
  }, [debts]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg">
        <p className="text-slate-400">No outstanding debt to display.</p>
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

export default DebtBreakdownChart;