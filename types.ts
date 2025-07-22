export interface Payment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export enum LoanDirection {
  IOwe = 'I Owe',
  TheyOwe = 'They Owe',
}

export enum LoanCategory {
  FRIEND = 'Friend/Family',
  BANK = 'Bank Loan',
}

export interface Loan {
  id:string;
  direction: LoanDirection;
  type: LoanCategory;
  name: string;
  totalAmount: number;
  startDate: string;
  returnDate?: string;
  notes?: string;
  interestRate?: number;
  payments: Payment[];
}

export interface Savings {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  deposits: Payment[];
}