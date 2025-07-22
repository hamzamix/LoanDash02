
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, colorClass = 'text-sky-400' }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-slate-700 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default Card;
