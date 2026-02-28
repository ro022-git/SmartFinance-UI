import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../../core/services/expense';
import { LoanService } from '../../../core/services/loan';
import { IExpense } from '../../../core/models/expense.model';
import { ILoan } from '../../../core/models/loan.model';

@Component({
  selector: 'app-loan-payments',
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-payments.html',
  styleUrl: './loan-payments.css',
})
export class LoanPayments implements OnInit{
  loanId: number = 0;
  loan: ILoan | null = null;
  payments: IExpense[] = [];
  
  loading = false;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.loanId) {
      this.router.navigate(['/loans']);
      return;
    }
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.loadLoanDetails();
    this.loadPayments();
  }

  loadLoanDetails() {
    this.loanService.getById(this.loanId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loan = {
            ...response.data,
            dueDate: new Date(response.data.dueDate),
            createdAt: new Date(response.data.createdAt),
            isOverdue: new Date(response.data.dueDate) < new Date() && response.data.remainingAmount > 0
          };
        }
      },
      error: () => {
        this.error = 'Failed to load loan details';
      }
    });
  }

  loadPayments() {
    this.expenseService.getByLoan(this.loanId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.payments = response.data.map((exp: any) => ({
            ...exp,
            date: new Date(exp.date),
            createdAt: new Date(exp.createdAt)
          }));
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load payments';
        this.loading = false;
      }
    });
  }

  deletePayment(id: number, description: string) {
    if (!confirm(`Are you sure you want to delete payment "${description}"?`)) {
      return;
    }

    this.expenseService.delete(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = 'Payment deleted successfully';
          this.loadData();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to delete payment';
      }
    });
  }

  getTotalPaid(): number {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  getRemainingPercentage(): number {
    if (!this.loan) return 0;
    const paid = this.getTotalPaid();
    return (paid / this.loan.totalAmount) * 100;
  }

  goBack() {
    this.router.navigate(['/loans']);
  }
}