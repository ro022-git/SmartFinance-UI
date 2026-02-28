import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IncomeService } from '../../../core/services/income';
import { CategoryService } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';
import { Income } from '../../../core/models/income.model';
import { ICategory } from '../../../core/models/category.model';

@Component({
  selector: 'app-income-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './income-list.html',
  styleUrl: './income-list.css',
})
export class IncomeList implements OnInit {
  incomes: Income[] = [];
  filteredIncomes: Income[] = [];
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

  constructor(
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
  this.categoryService.getByType('Income').subscribe({
    next: (response: any) => {
      if (response.success) {
        this.categories = response.data.map((cat: any) => ({
          ...cat,
          id: Number(cat.id)
        }));
        console.log('Categories loaded (with numeric IDs):', this.categories);
        this.loadIncomes();
      }
    },
    error: (err) => {
      console.error('Error loading categories:', err);
    }
  });
}

  loadIncomes() {
    this.loading = true;
    this.error = '';

    this.incomeService.getAll().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.incomes = response.data.map((inc: any) => ({
            ...inc,
            date: new Date(inc.date),
            createdAt: new Date(inc.createdAt)
          }));

          this.calculateTotal();
          this.applyFilters();
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incomes:', err);
        this.error = 'Failed to load incomes';
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.incomes.reduce((sum, inc) => sum + inc.amount, 0);
  }

  applyFilters() {
    let filtered = [...this.incomes];

    if (this.selectedCategory && this.selectedCategory !== 0) {
      const selectedId = Number(this.selectedCategory);
      filtered = filtered.filter(inc => Number(inc.categoryId) === selectedId);
    }

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(inc => {
        const incDate = new Date(inc.date);
        return incDate >= start && incDate <= end;
      });
    }

    this.filteredIncomes = filtered;
    this.filteredTotal = filtered.reduce((sum, inc) => sum + inc.amount, 0);
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
  if (!categoryId || categoryId === 0) return 'All Categories';
  
  const searchId = Number(categoryId);
  const category = this.categories.find(c => Number(c.id) === searchId);
  
  if (!category) {
    console.warn(`Category ID ${searchId} not found. Available IDs:`, 
      this.categories.map(c => Number(c.id)));
    return `Unknown (ID: ${categoryId})`;
  }
  
  return category.name;
}

  getCategoriesWithIncomes() {
    const categoryIdsWithIncome = [...new Set(this.incomes.map(inc => inc.categoryId))];
    return this.categories.filter(cat => categoryIdsWithIncome.includes(cat.id));
  }

  getCategoryIncomeCount(categoryId: number): number {
    return this.incomes.filter(inc => inc.categoryId === categoryId).length;
  }

  deleteIncome(id: number, source: string) {
    if (!confirm(`Delete income "${source}"?`)) return;

    this.incomeService.delete(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = 'Income deleted successfully';
          this.loadIncomes();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to delete income';
      }
    });
  }
}