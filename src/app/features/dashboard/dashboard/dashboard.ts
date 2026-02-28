import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard';
import { DashboardSummary, MonthlySummary, CategoryBreakdown, RecentTransaction } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  summary: DashboardSummary | null = null;
  recentTransactions: RecentTransaction[] = [];
  topIncomeCategories: CategoryBreakdown[] = [];
  topExpenseCategories: CategoryBreakdown[] = [];

  loading = false;
  error = '';

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number | null = null;
  availableYears: number[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.generateYearRange();
    this.loadDashboardData();
  }

  generateYearRange() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 2; year <= currentYear + 1; year++) {
      this.availableYears.push(year);
    }
  }

  loadDashboardData() {
    this.loading = true;
    this.error = '';

    this.dashboardService.getSummary(this.selectedYear, this.selectedMonth || undefined).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.summary = response.data;
          this.recentTransactions = response.data.recentTransactions || [];
          this.topIncomeCategories = response.data.topIncomeCategories || [];
          this.topExpenseCategories = response.data.topExpenseCategories || [];
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.loadDashboardData();
  }

  clearFilters() {
    this.selectedMonth = null;
    this.loadDashboardData();
  }

  getBalanceClass(): string {
    if (!this.summary) return '';
    return this.summary.balance >= 0 ? 'text-success' : 'text-danger';
  }

  getSavingsClass(month: MonthlySummary): string {
    return month.savings >= 0 ? 'text-success' : 'text-danger';
  }
}