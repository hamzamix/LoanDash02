import React, { useState, useMemo } from 'react';
import { Loan, LoanCategory, LoanDirection, Payment } from '../types.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import { IconPlus, IconTrash, IconPencil, IconArrowDownLeft, IconArrowUpRight } from '../constants.tsx';
import Modal from './Modal.tsx';
import ProgressBar from './ProgressBar.tsx';

interface LoansViewProps {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'payments'>) => void;
  updateLoan: (loan: Loan) => void;
  deleteLoan: (id: string) => void;
  addPayment: (loanId: string, payment: Omit<Payment, 'id'>) => void;
}

const LoanForm: React.FC<{ onSave: (loan: Omit<Loan, 'id' | 'payments'>) => void; initialData?: Omit<Loan, 'id' | 'payments'>, onClose: () => void; }> = ({ onSave, initialData, onClose }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [totalAmount, setTotalAmount] = useState(initialData?.totalAmount || 0);
    const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState(initialData?.returnDate || '');
    const [type, setType] = useState(initialData?.type || LoanCategory.FRIEND);
    const [direction, setDirection] = useState(initialData?.direction || LoanDirection.IOwe);
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, totalAmount, startDate, returnDate, type, direction, notes });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300">Direction</label>
                <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg bg-slate-900 p-1">
                    <button type="button" onClick={() => setDirection(LoanDirection.IOwe)} className={`px-4 py-2 text-sm rounded-md transition-colors ${direction === LoanDirection.IOwe ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>I Owe</button>
                    <button type="button" onClick={() => setDirection(LoanDirection.TheyOwe)} className={`px-4 py-2 text-sm rounded-md transition-colors ${direction === LoanDirection.TheyOwe ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>They Owe</button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Loan Name / Person</label>
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
                <label className="block text-sm font-medium text-slate-300">Category</label>
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

const PaymentForm: React.FC<{ onSave: (payment: Omit<Payment, 'id'>) => void; onClose: () => void; isReceiving: boolean }> = ({ onSave, onClose, isReceiving }) => {
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
                <label className="block text-sm font-medium text-slate-300">Amount</label>
                <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white">{isReceiving ? 'Log Received Payment' : 'Log My Payment'}</button>
            </div>
        </form>
    );
};


const LoanItem: React.FC<{ loan: Loan; onUpdate: (loan: Loan) => void; onDelete: (id: string) => void; onAddPayment: (loanId: string, payment: Omit<Payment, 'id'>) => void; }> = ({ loan, onUpdate, onDelete, onAddPayment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [showPayments, setShowPayments] = useState(false);
    
    const totalPaid = useMemo(() => loan.payments.reduce((acc, p) => acc + p.amount, 0), [loan.payments]);
    const remaining = loan.totalAmount - totalPaid;
    const isReceiving = loan.direction === LoanDirection.TheyOwe;

    const handleUpdate = (updatedLoan: Omit<Loan, 'id' | 'payments'>) => {
        onUpdate({ ...loan, ...updatedLoan});
        setIsEditing(false);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 shadow-md space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {isReceiving ? <IconArrowUpRight className="w-5 h-5 text-green-400" /> : <IconArrowDownLeft className="w-5 h-5 text-red-400" />}
                      {loan.name}
                    </h3>
                    <p className="text-sm text-slate-400">{isReceiving ? 'They Owe:' : 'I Owe:'} {formatCurrency(loan.totalAmount)} <span className="text-xs font-medium bg-slate-700 text-sky-400 px-2 py-1 rounded-full ml-2">{loan.type}</span></p>
                    <p className="text-xs text-slate-500">
                        Since: {formatDate(loan.startDate)}
                        {loan.returnDate && ` • Due: ${formatDate(loan.returnDate)}`}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-sky-400"><IconPencil className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(loan.id)} className="p-2 text-slate-400 hover:text-red-400"><IconTrash className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{formatCurrency(totalPaid)} {isReceiving ? 'Received' : 'Paid'}</span>
                    <span className="text-slate-300 font-medium">{formatCurrency(remaining)} Remaining</span>
                </div>
                <ProgressBar current={totalPaid} total={loan.totalAmount} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => setIsAddingPayment(true)} className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-md text-white">{isReceiving ? 'Log Received Payment' : 'Log My Payment'}</button>
                <button onClick={() => setShowPayments(!showPayments)} className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 rounded-md text-white">{showPayments ? 'Hide' : 'Show'} Payments ({loan.payments.length})</button>
            </div>

            {showPayments && (
                <div className="pt-2 mt-2 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Payment History</h4>
                    {loan.payments.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {[...loan.payments].reverse().map(p => (
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
                <LoanForm onSave={handleUpdate} initialData={loan} onClose={() => setIsEditing(false)} />
            </Modal>
            <Modal isOpen={isAddingPayment} onClose={() => setIsAddingPayment(false)} title={`${isReceiving ? 'Log Payment Received from' : 'Log Payment Made to'} ${loan.name}`}>
                <PaymentForm onSave={(payment) => onAddPayment(loan.id, payment)} onClose={() => setIsAddingPayment(false)} isReceiving={isReceiving} />
            </Modal>
        </div>
    );
};

const LoansView: React.FC<LoansViewProps> = ({ loans, addLoan, updateLoan, deleteLoan, addPayment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'unpaid' | 'paid'>('unpaid');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'iOwe' | 'theyOwe'>('all');

  const filteredLoans = useMemo(() => {
    return loans.filter(l => {
        const remaining = l.totalAmount - l.payments.reduce((acc, p) => acc + p.amount, 0);
        const statusMatch = statusFilter === 'paid' ? remaining <= 0 : remaining > 0;

        const directionMatch = 
            directionFilter === 'all' ||
            (directionFilter === 'iOwe' && l.direction === LoanDirection.IOwe) ||
            (directionFilter === 'theyOwe' && l.direction === LoanDirection.TheyOwe);
        
        return statusMatch && directionMatch;
    });
  }, [loans, statusFilter, directionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
            <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setStatusFilter('unpaid')} className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'unpaid' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>Unpaid</button>
                <button onClick={() => setStatusFilter('paid')} className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'paid' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>Paid</button>
            </div>
             <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setDirectionFilter('all')} className={`px-3 py-1 text-sm rounded-md ${directionFilter === 'all' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>All</button>
                <button onClick={() => setDirectionFilter('iOwe')} className={`px-3 py-1 text-sm rounded-md ${directionFilter === 'iOwe' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>I Owe</button>
                <button onClick={() => setDirectionFilter('theyOwe')} className={`px-3 py-1 text-sm rounded-md ${directionFilter === 'theyOwe' ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'}`}>They Owe</button>
            </div>
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
        {filteredLoans.map(loan => (
          <LoanItem key={loan.id} loan={loan} onUpdate={updateLoan} onDelete={deleteLoan} onAddPayment={addPayment} />
        ))}
      </div>
      {filteredLoans.length === 0 && <p className="text-center text-slate-400 py-8">No loans in this category.</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Loan">
        <LoanForm onSave={addLoan} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LoansView;