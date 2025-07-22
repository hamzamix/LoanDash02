import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import DashboardView from './components/DashboardView.tsx';
import LoansView from './components/LoansView.tsx';
import useLocalStorage from './hooks/useLocalStorage.ts';
import { Loan, Payment } from './types.ts';

type Tab = 'dashboard' | 'loans';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [loans, setLoans] = useLocalStorage<Loan[]>('loans', []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Loan Management
  const addLoan = (loan: Omit<Loan, 'id' | 'payments'>) => {
    setLoans(prev => [...prev, { ...loan, id: crypto.randomUUID(), payments: [] }]);
  };

  const updateLoan = (updatedLoan: Loan) => {
    setLoans(prev => prev.map(l => l.id === updatedLoan.id ? updatedLoan : l));
  };
  
  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const addPayment = (loanId: string, payment: Omit<Payment, 'id'>) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return { ...l, payments: [...l.payments, { ...payment, id: crypto.randomUUID() }] };
      }
      return l;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView loans={loans} />;
      case 'loans':
        return <LoansView loans={loans} addLoan={addLoan} updateLoan={updateLoan} deleteLoan={deleteLoan} addPayment={addPayment} />;
      default:
        return <DashboardView loans={loans} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;