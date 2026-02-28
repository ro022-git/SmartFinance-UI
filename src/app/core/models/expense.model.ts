export interface IExpense {
  id: number;
  amount: number;
  description: string;
  date: Date;
  categoryId: number;
  categoryName: string;
  loanId?: number;
  loanName?: string;
  createdAt: Date;
}

export interface CreateExpenseDto {
  amount: number;
  description: string;
  date: Date;
  categoryId: number;
  loanId?: number | null;
}

export interface UpdateExpenseDto {
  id: number;
  amount: number;
  description: string;
  date: Date;
  categoryId: number;
  loanId?: number | null;
}

export interface ExpenseCategoryOption {
  id: number;
  name: string;
  type: 'Expense';
}

export interface LoanOption {
  id: number;
  lenderName: string;
  remainingAmount: number;
}