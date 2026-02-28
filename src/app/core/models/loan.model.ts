export interface ILoan {
  id: number;
  lenderName: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate: Date;
  createdAt: Date;
  isOverdue?: boolean;
  paidAmount?: number;
  paidPercentage?: number;
}

export interface CreateLoanDto {
  lenderName: string;
  totalAmount: number;
  dueDate: Date;
}

export interface UpdateLoanDto {
  id: number;
  lenderName: string;
  totalAmount: number;
  dueDate: Date;
}

export interface LoanSummary {
  totalLoaned: number;
  totalRemaining: number;
  totalPaid: number;
  activeLoanCount: number;
  overdueLoanCount: number;
}

export interface LoanPayment {
  id: number;
  amount: number;
  date: Date;
  description: string;
}