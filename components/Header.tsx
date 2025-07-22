import React from 'react';
import { IconDashboard, IconLoans, IconSun, IconMoon } from '../constants.tsx';

type Tab = 'dashboard' | 'loans';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const tabs: { id: Tab, name: string, icon: React.ReactNode }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <IconDashboard className="w-5 h-5" /> },
    { id: 'loans', name: 'Loans', icon: <IconLoans className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-slate-950 p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">LoanDash</h1>
        
        <nav className="hidden md:flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
          {theme === 'dark' ? <IconSun className="w-6 h-6 text-yellow-400" /> : <IconMoon className="w-6 h-6 text-slate-400" />}
        </button>
      </div>

      {/* Mobile navigation */}
      <nav className="md:hidden mt-4">
          <div className="flex justify-around bg-slate-800 p-1 rounded-lg">
            {tabs.map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-md text-xs font-medium transition-colors w-full ${
                    activeTab === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
                >
                {tab.icon}
                <span className="mt-1">{tab.name}</span>
                </button>
            ))}
          </div>
      </nav>

    </header>
  );
};

export default Header;