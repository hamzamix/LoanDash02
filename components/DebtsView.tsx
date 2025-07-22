import React, { useState, useMemo } from 'react';
import { Loan, LoanCategory, Payment, LoanDirection } from '../types.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import { IconPlus, IconTrash, IconPencil } from '../constants.tsx';
import Modal from './Modal.tsx';
import ProgressBar from './ProgressBar.tsx';

interface DebtsViewProps {
  debts: Loan[];
  addDebt: (debt: Omit<Loan, 'id' | 'payments'>) => void;
  updateDebt: (debt: Loan) => void;
  deleteDebt: (id: string) => void;
  addPayment: (debtId: string, payment: Omit<Payment, 'id'>) => void;
}

const DebtForm: React.FC<{ onSave: (debt: Omit<Loan, 'id' | 'payments'>) => void; initialData?: Omit<Loan, 'id' | 'payments'>, onClose: () => void; }> = ({ onSave, initialData, onClose }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [totalAmount, setTotalAmount] = useState(initialData?.totalAmount || 0);
    const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState(initialData?.returnDate || '');
    const [type, setType] = useState(initialData?.type || LoanCategory.FRIEND);
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, totalAmount, startDate, returnDate, type, notes, direction: LoanDirection.IOwe });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Total Amount</label>
                <input type="number" value={totalAmount} onChange={e => setTotalAmount(parseFloat(e.target.value))} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300">Return Date (Optional)</label>
                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Type</label>
                <select value={type} onChange={e => setType(e.target.value as LoanCategory)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500">
                    <option value={LoanCategory.FRIEND}>{LoanCategory.FRIEND}</option>
                    <option value={LoanCategory.BANK}>{LoanCategory.BANK}</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white">Save Loan</button>
            </div>
        </form>
    );
};

const PaymentForm: React.FC<{ onSave: (payment: Omit<Payment, 'id'>) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
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
                <label className="block text-sm font-medium text-slate-300">Payment Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Payment Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white">Log Payment</button>
            </div>
        </form>
    );
};


const DebtItem: React.FC<{ debt: Loan; onUpdate: (debt: Loan) => void; onDelete: (id: string) => void; onAddPayment: (debtId: string, payment: Omit<Payment, 'id'>) => void; }> = ({ debt, onUpdate, onDelete, onAddPayment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [showPayments, setShowPayments] = useState(false);
    
    const totalPaid = useMemo(() => debt.payments.reduce((acc, p) => acc + p.amount, 0), [debt.payments]);
    const remaining = debt.totalAmount - totalPaid;

    const handleUpdate = (updatedDebt: Omit<Loan, 'id' | 'payments'>) => {
        onUpdate({ ...debt, ...updatedDebt});
        setIsEditing(false);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 shadow-md space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">{debt.name} <span className="text-xs font-medium bg-slate-700 text-sky-400 px-2 py-1 rounded-full">{debt.type}</span></h3>
                    <p className="text-sm text-slate-400">Owed: {formatCurrency(debt.totalAmount)}</p>
                    <p className="text-xs text-slate-500">
                        Since: {formatDate(debt.startDate)}
                        {debt.returnDate && `  •  Due: ${formatDate(debt.returnDate)}`}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-sky-400"><IconPencil className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(debt.id)} className="p-2 text-slate-400 hover:text-red-400"><IconTrash className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{formatCurrency(totalPaid)} Paid</span>
                    <span className="text-slate-300 font-medium">{formatCurrency(remaining)} Remaining</span>
                </div>
                <ProgressBar current={totalPaid} total={debt.totalAmount} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => setIsAddingPayment(true)} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-md text-white">Log Payment</button>
                <button onClick={() => setShowPayments(!showPayments)} className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded-md text-white">{showPayments ? 'Hide' : 'Show'} Payments ({debt.payments.length})</button>
            </div>

            {showPayments && (
                <div className="pt-2 mt-2 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Payment History</h4>
                    {debt.payments.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {debt.payments.map(p => (
                                <li key={p.id} className="text-sm flex justify-between items-center bg-slate-700 p-2 rounded-md">
                                    <div>
                                        <p className="text-slate-200">{formatCurrency(p.amount)} on {formatDate(p.date)}</p>
                                        {p.notes && <p className="text-xs text-slate-400">{p.notes}</p>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400">No payments logged yet.</p>
                    )}
                </div>
            )}
            
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Loan">
                <DebtForm onSave={handleUpdate} initialData={debt} onClose={() => setIsEditing(false)} />
            </Modal>
            <Modal isOpen={isAddingPayment} onClose={() => setIsAddingPayment(false)} title={`Add Payment to ${debt.name}`}>
                <PaymentForm onSave={(payment) => onAddPayment(debt.id, payment)} onClose={() => setIsAddingPayment(false)} />
            </Modal>
        </div>
    );
};

const DebtsView: React.FC<DebtsViewProps> = ({ debts, addDebt, updateDebt, deleteDebt, addPayment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('unpaid');

  const filteredDebts = useMemo(() => {
    const loansIOwe = debts.filter(d => d.direction === LoanDirection.IOwe);
    if (filter === 'all') return loansIOwe;
    return loansIOwe.filter(d => {
        const remaining = d.totalAmount - d.payments.reduce((acc, p) => acc + p.amount, 0);
        return filter === 'paid' ? remaining <= 0 : remaining > 0;
    });
  }, [debts, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
            <button onClick={() => setFilter('unpaid')} className={`px-4 py-2 text-sm rounded-md ${filter === 'unpaid' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>Unpaid</button>
            <button onClick={() => setFilter('paid')} className={`px-4 py-2 text-sm rounded-md ${filter === 'paid' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>Paid</button>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm rounded-md ${filter === 'all' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>All</button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <IconPlus className="w-5 h-5" />
          <span>Add New Loan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDebts.map(debt => (
          <DebtItem key={debt.id} debt={debt} onUpdate={updateDebt} onDelete={deleteDebt} onAddPayment={addPayment} />
        ))}
      </div>
      {filteredDebts.length === 0 && <p className="text-center text-slate-400 py-8">No debts in this category.</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Loan">
        <DebtForm onSave={addDebt} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DebtsView;