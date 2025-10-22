
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // ISO string date
  category?: string; // For income or categorized expenses
  status?: ExpenseStatus; // For expenses
}