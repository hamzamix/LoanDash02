
import React, { useState, useMemo } from 'react';
import { Savings, Payment } from '../types.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import { IconPlus, IconTrash, IconPencil } from '../constants.tsx';
import Modal from './Modal.tsx';
import ProgressBar from './ProgressBar.tsx';

interface SavingsViewProps {
  savings: Savings[];
  addSaving: (saving: Omit<Savings, 'id' | 'deposits' | 'currentAmount'>) => void;
  updateSaving: (saving: Savings) => void;
  deleteSaving: (id: string) => void;
  addDeposit: (savingId: string, deposit: Omit<Payment, 'id'>) => void;
}

const SavingForm: React.FC<{ onSave: (saving: Omit<Savings, 'id' | 'deposits' | 'currentAmount'>) => void; initialData?: Omit<Savings, 'id' | 'deposits'>, onClose: () => void; }> = ({ onSave, initialData, onClose }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [goalAmount, setGoalAmount] = useState(initialData?.goalAmount || 1000);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, goalAmount });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300">Goal Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Goal Amount</label>
                <input type="number" value={goalAmount} onChange={e => setGoalAmount(parseFloat(e.target.value))} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white">Save Goal</button>
            </div>
        </form>
    );
};

const DepositForm: React.FC<{ onSave: (deposit: Omit<Payment, 'id'>) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ amount, date, notes });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-300">Deposit Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Deposit Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white">Log Deposit</button>
            </div>
        </form>
    );
};

const SavingItem: React.FC<{ saving: Savings; onUpdate: (saving: Savings) => void; onDelete: (id: string) => void; onAddDeposit: (savingId: string, deposit: Omit<Payment, 'id'>) => void; }> = ({ saving, onUpdate, onDelete, onAddDeposit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingDeposit, setIsAddingDeposit] = useState(false);
    
    const handleUpdate = (updatedSaving: Omit<Savings, 'id' | 'deposits' | 'currentAmount'>) => {
        onUpdate({ ...saving, ...updatedSaving });
        setIsEditing(false);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 shadow-md space-y-3">
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">{saving.name}</h3>
                    <p className="text-sm text-slate-400">Goal: {formatCurrency(saving.goalAmount)}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-sky-400"><IconPencil className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(saving.id)} className="p-2 text-slate-400 hover:text-red-400"><IconTrash className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{formatCurrency(saving.currentAmount)} Saved</span>
                    <span className="text-slate-300 font-medium">{((saving.currentAmount / saving.goalAmount) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar current={saving.currentAmount} total={saving.goalAmount} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => setIsAddingDeposit(true)} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-md text-white">Add Deposit</button>
            </div>
            
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Savings Goal">
                <SavingForm onSave={handleUpdate} initialData={saving} onClose={() => setIsEditing(false)} />
            </Modal>
            <Modal isOpen={isAddingDeposit} onClose={() => setIsAddingDeposit(false)} title={`Add Deposit to ${saving.name}`}>
                <DepositForm onSave={(deposit) => onAddDeposit(saving.id, deposit)} onClose={() => setIsAddingDeposit(false)} />
            </Modal>
        </div>
    );
};

const SavingsView: React.FC<SavingsViewProps> = ({ savings, addSaving, updateSaving, deleteSaving, addDeposit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <IconPlus className="w-5 h-5" />
          <span>Add New Savings Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savings.map(s => (
          <SavingItem key={s.id} saving={s} onUpdate={updateSaving} onDelete={deleteSaving} onAddDeposit={addDeposit} />
        ))}
      </div>
      {savings.length === 0 && <p className="text-center text-slate-400 py-8">No savings goals yet. Add one to get started!</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Savings Goal">
        <SavingForm onSave={addSaving} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default SavingsView;