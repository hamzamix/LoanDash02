export interface Payment {
  id: string;
  amount: number;
  date: string; // ISO string
}

export enum DebtType {
  Friend = 'Friend/Family Credit',
  Loan = 'Bank Loan'
}

export interface Debt {
  id: string;
  type: DebtType;
  name: string;
  totalAmount: number;
  startDate: string; // ISO string
  dueDate: string; // ISO string
  payments: Payment[];
  description?: string;
  interestRate?: number; // Optional for loans
  isRecurring?: boolean; // Optional for recurring debts
  status: 'active' | 'completed' | 'defaulted';
}

export interface Loan {
    id: string;
    name: string; // Who you loaned to
    totalAmount: number;
    startDate: string; // ISO string
    dueDate: string; // ISO string
    repayments: Payment[];
    description?: string;
    status: 'active' | 'completed' | 'defaulted';
}