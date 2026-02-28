export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalLoanAmount: number;
  remainingLoanAmount: number;
  paidLoanAmount: number;

  incomeCount: number;
  expenseCount: number;
  activeLoanCount: number;
  overdueLoanCount: number;

  monthlyBreakdown: MonthlySummary[];
  topIncomeCategories: CategoryBreakdown[];
  topExpenseCategories: CategoryBreakdown[];
  recentTransactions: RecentTransaction[];
}

export interface MonthlySummary {
  year: number;
  month: number;
  monthName: string;
  income: number;
  expense: number;
  savings: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
}

export interface RecentTransaction {
  id: number;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  categoryName: string;
  date: Date;
}