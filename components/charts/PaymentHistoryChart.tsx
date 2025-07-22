import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loan, LoanDirection } from '../../types.ts';
import { formatCurrency } from '../../utils/formatters.ts';

interface PaymentHistoryChartProps {
  loans: Loan[];
}

const PaymentHistoryChart: React.FC<PaymentHistoryChartProps> = ({ loans }) => {
  const chartData = useMemo(() => {
    const data: { [key: string]: { month: string, made: number, received: number } } = {};

    loans.forEach(loan => {
        loan.payments.forEach(p => {
            const date = new Date(p.date);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!data[month]) {
              data[month] = { month, made: 0, received: 0 };
            }
            if(loan.direction === LoanDirection.IOwe) {
                data[month]['made'] += p.amount;
            } else {
                data[month]['received'] += p.amount;
            }
        });
    });
    
    const sortedData = Object.values(data).sort((a,b) => {
        const dateA = new Date(`1 ${a.month}`);
        const dateB = new Date(`1 ${b.month}`);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedData.slice(-12); // Last 12 months
  }, [loans]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg">
        <p className="text-slate-400">No payment history to display.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a53" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(Number(value))}/>
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
          labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
          cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
        />
        <Legend iconType="circle" />
        <Bar dataKey="made" stackId="a" name="Payments Made" fill="#ef4444" />
        <Bar dataKey="received" stackId="a" name="Payments Received" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PaymentHistoryChart;