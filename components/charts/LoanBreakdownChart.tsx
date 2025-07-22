import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Loan, LoanDirection } from '../../types.ts';
import { formatCurrency } from '../../utils/formatters.ts';

interface LoanBreakdownChartProps {
  loans: Loan[];
}

const I_OWE_COLORS = ['#f87171', '#fb923c', '#fbbf24'];
const THEY_OWE_COLORS = ['#4ade80', '#34d399', '#22c55e'];

const CustomPieChart: React.FC<{data: {name: string, value: number}[], colors: string[]}> = ({ data, colors }) => (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'rgba(9, 14, 26, 0.9)',
            borderColor: '#2a3a53',
            borderRadius: '0.5rem',
            borderWidth: 1,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
          itemStyle={{ color: '#e2e8f0' }}
          cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
        />
        <Legend iconType="circle" />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
);

const LoanBreakdownChart: React.FC<LoanBreakdownChartProps> = ({ loans }) => {
  const processData = (direction: LoanDirection) => {
     return loans
      .filter(loan => loan.direction === direction)
      .map(loan => {
        const totalPaid = loan.payments.reduce((acc, p) => acc + p.amount, 0);
        const remaining = loan.totalAmount - totalPaid;
        return {
          name: loan.name,
          value: remaining,
        };
      })
      .filter(d => d.value > 0)
      .sort((a,b) => b.value - a.value);
  }
  
  const iOweData = useMemo(() => processData(LoanDirection.IOwe), [loans]);
  const theyOweData = useMemo(() => processData(LoanDirection.TheyOwe), [loans]);

  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">What I Owe</h3>
            {iOweData.length > 0 ? (
                <CustomPieChart data={iOweData} colors={I_OWE_COLORS} />
            ) : (
                <div className="flex items-center justify-center h-24 bg-slate-800 rounded-lg">
                    <p className="text-slate-400">You don't owe anything. Great job!</p>
                </div>
            )}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">What's Owed To Me</h3>
             {theyOweData.length > 0 ? (
                <CustomPieChart data={theyOweData} colors={THEY_OWE_COLORS} />
            ) : (
                <div className="flex items-center justify-center h-24 bg-slate-800 rounded-lg">
                    <p className="text-slate-400">No one owes you money.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default LoanBreakdownChart;