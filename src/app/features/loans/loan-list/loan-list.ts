import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ILoan, LoanSummary } from '../../../core/models/loan.model';
import { LoanService } from '../../../core/services/loan';

@Component({
  selector: 'app-loan-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css',
})
export class LoanList implements OnInit {
  loans: ILoan[] = [];
  summary: LoanSummary | null = null;
  
  loading = false;
  error = '';
  success = '';

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.loadLoans();
    this.loadSummary();
  }

  loadLoans() {
    this.loanService.getAll().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loans = response.data.map((loan: any) => ({
            ...loan,
            dueDate: new Date(loan.dueDate),
            createdAt: new Date(loan.createdAt),
            isOverdue: new Date(loan.dueDate) < new Date() && loan.remainingAmount > 0,
            paidAmount: loan.totalAmount - loan.remainingAmount,
            paidPercentage: ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100
          }));
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load loans';
        this.loading = false;
      }
    });
  }

  loadSummary() {
    this.loanService.getSummary().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.summary = response.data;
        }
      },
      error: () => {
        console.error('Failed to load summary');
      }
    });
  }

  deleteLoan(id: number, lenderName: string) {
    if (!confirm(`Delete loan from "${lenderName}"?`)) return;
    
    this.loanService.delete(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = 'Loan deleted successfully';
          this.loadData();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to delete loan';
      }
    });
  }

  getStatusClass(loan: ILoan): string {
    if (loan.remainingAmount === 0) return 'badge bg-success';
    if (loan.isOverdue) return 'badge bg-danger';
    return 'badge bg-warning';
  }

  getStatusText(loan: ILoan): string {
    if (loan.remainingAmount === 0) return 'Paid';
    if (loan.isOverdue) return 'Overdue';
    return 'Active';
  }
}