import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICategory } from '../../../core/models/category.model';
import { IncomeService } from '../../../core/services/income';
import { CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-income-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './income-form.html',
  styleUrl: './income-form.css',
})
export class IncomeForm implements OnInit{
  incomeForm: FormGroup;
  categories: ICategory[] = [];
  
  isEditMode = false;
  incomeId: number | null = null;
  
  loading = false;
  submitting = false;
  error = '';
  success = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.incomeForm = this.formBuilder.group({
      source: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [today, Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.incomeId = +id;
      this.loadIncome();
    }
  }

  loadCategories() {
    this.categoryService.getByType('Income').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data;
        }
      }
    });
  }

  loadIncome() {
    this.loading = true;
    this.incomeService.getById(this.incomeId!).subscribe({
      next: (response: any) => {
        if (response.success) {
          const income = response.data;
          const date = new Date(income.date).toISOString().split('T')[0];
          this.incomeForm.patchValue({
            source: income.source,
            amount: income.amount,
            date: date,
            categoryId: income.categoryId
          });
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load income';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.incomeForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = {
      ...this.incomeForm.value,
      date: new Date(this.incomeForm.value.date)
    };

    if (this.isEditMode && this.incomeId) {
      this.incomeService.update(this.incomeId, { id: this.incomeId, ...formValue }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Income updated successfully';
            setTimeout(() => this.router.navigate(['/incomes']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to update income';
          this.submitting = false;
        }
      });
    } else {
      this.incomeService.create(formValue).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Income added successfully';
            setTimeout(() => this.router.navigate(['/incomes']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to add income';
          this.submitting = false;
        }
      });
    }
  }

  get f() { return this.incomeForm.controls; }
}