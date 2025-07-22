import React, { useMemo } from 'react';
import { Loan, LoanDirection } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';
import Card from './Card.tsx';
import LoanBreakdownChart from './charts/LoanBreakdownChart.tsx';
import PaymentHistoryChart from './charts/PaymentHistoryChart.tsx';
import { IconArrowDownLeft, IconArrowUpRight } from '../constants.tsx';

interface DashboardViewProps {
  loans: Loan[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ loans }) => {
  const summary = useMemo(() => {
    const getRemaining = (loan: Loan) => loan.totalAmount - loan.payments.reduce((pAcc, p) => pAcc + p.amount, 0);

    const totalIOwe = loans
        .filter(l => l.direction === LoanDirection.IOwe)
        .reduce((acc, loan) => acc + getRemaining(loan), 0);
    
    const totalOwedToMe = loans
        .filter(l => l.direction === LoanDirection.TheyOwe)
        .reduce((acc, loan) => acc + getRemaining(loan), 0);

    return { totalIOwe, totalOwedToMe };
  }, [loans]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Total I Owe" value={formatCurrency(summary.totalIOwe)} icon={<IconArrowDownLeft className="w-6 h-6"/>} colorClass="text-red-400" />
        <Card title="Total Owed To Me" value={formatCurrency(summary.totalOwedToMe)} icon={<IconArrowUpRight className="w-6 h-6" />} colorClass="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-900 p-4 sm:p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Monthly Payment Activity</h2>
          <PaymentHistoryChart loans={loans} />
        </div>
        <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Outstanding Loans</h2>
            <LoanBreakdownChart loans={loans} />
        </div>
      </div>

    </div>
  );
};

export default DashboardView;