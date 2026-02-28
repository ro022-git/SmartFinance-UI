import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICategory } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  categories: ICategory[] = [];
  filteredCategories: ICategory[] = [];
  
  loading = false;
  error = '';
  success = '';
  
  selectedType: string = 'All';
  searchText: string = '';  
  startDate: string = '';   
  endDate: string = '';     
  
  isAdmin = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';
    
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data
            .map((cat: any) => ({
              ...cat,
              createdAt: new Date(cat.createdAt)
            }))
            .sort((a: ICategory, b: ICategory) => a.id - b.id);
          
          this.applyFilters();
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.categories];
    
    if (this.selectedType !== 'All') {
      filtered = filtered.filter(c => c.type === this.selectedType);
    }
    
    if (this.searchText && this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).setHours(0,0,0,0);
      const end = new Date(this.endDate).setHours(23,59,59,999);
      
      filtered = filtered.filter(c => {
        const catDate = new Date(c.createdAt).getTime();
        return catDate >= start && catDate <= end;
      });
    }
    
    this.filteredCategories = filtered;
    
    console.log('Total Categories:', this.categories.length);
    console.log('Filtered Categories:', this.filteredCategories.length);
    console.log('Applied Filters:', {
      type: this.selectedType,
      search: this.searchText,
      dateRange: this.startDate && this.endDate ? `${this.startDate} to ${this.endDate}` : 'none'
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedType = 'All';
    this.searchText = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  deleteCategory(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    this.categoryService.delete(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = `Category "${name}" deleted successfully`;
          this.loadCategories();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.message;
        }
      },
      error: () => {
        this.error = 'Failed to delete category';
      }
    });
  }
}