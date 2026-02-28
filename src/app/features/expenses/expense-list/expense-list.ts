import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IExpense } from '../../../core/models/expense.model';
import { ICategory } from '../../../core/models/category.model';
import { ExpenseService } from '../../../core/services/expense';
import { AuthService } from '../../../core/services/auth';
import { CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenses: IExpense[] = [];
  filteredExpenses: IExpense[] = [];
  categories: ICategory[] = [];
  
  loading = false;
  error = '';
  success = '';
  
  selectedCategory: number = 0;
  startDate: string = '';
  endDate: string = '';
  
  totalAmount: number = 0;
  filteredTotal: number = 0;
  
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getByType('Expense').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data;
          this.loadExpenses();
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories';
      }
    });
  }

  loadExpenses() {
    this.loading = true;
    this.error = '';
    
    this.expenseService.getAll().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.expenses = response.data.map((exp: any) => ({
            ...exp,
            date: new Date(exp.date),
            createdAt: new Date(exp.createdAt)
          }));
          
          this.calculateTotal();
          this.applyFilters();
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
        this.error = 'Failed to load expenses';
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  applyFilters() {
    let filtered = [...this.expenses];
    
    if (this.selectedCategory && this.selectedCategory !== 0) {
      filtered = filtered.filter(exp => Number(exp.categoryId) === Number(this.selectedCategory));
    }
    
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date).getTime();
        return expDate >= start.getTime() && expDate <= end.getTime();
      });
    }
    
    this.filteredExpenses = filtered;
    this.filteredTotal = filtered.reduce((sum, exp) => sum + exp.amount, 0);
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = 0;
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => Number(c.id) === Number(categoryId));
    return category ? category.name : 'Unknown';
  }

  deleteExpense(id: number, description: string) {
    if (!confirm(`Delete expense "${description}"?`)) return;
    
    this.expenseService.delete(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = 'Expense deleted successfully';
          this.loadExpenses();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to delete expense';
      }
    });
  }
}