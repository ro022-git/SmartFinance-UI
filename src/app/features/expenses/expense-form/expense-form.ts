import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICategory } from '../../../core/models/category.model';
import { ExpenseService } from '../../../core/services/expense';
import { CategoryService } from '../../../core/services/category';
import { LoanService } from '../../../core/services/loan';
import { ILoan } from '../../../core/models/loan.model';

@Component({
  selector: 'app-expense-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  expenseForm: FormGroup;
  categories: ICategory[] = [];
  loans: ILoan[] = [];

  isEditMode = false;
  expenseId: number | null = null;

  loading = false;
  submitting = false;
  error = '';
  success = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.expenseForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [today, Validators.required],
      categoryId: ['', Validators.required],
      loanId: [null]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadLoans();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.expenseId = +id;
      this.loadExpense();
    }

    this.route.queryParams.subscribe(params => {
      if (params['loanId']) {
        this.expenseForm.patchValue({
          loanId: Number(params['loanId'])
        });
      }
    });
  }

  loadCategories() {
    this.categoryService.getByType('Expense').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadLoans() {
    this.loanService.getActive().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loans = response.data;
        }
      },
      error: (err: any) => {
        console.error('Error loading loans:', err);
      }
    });
  }

  loadExpense() {
    this.loading = true;
    this.expenseService.getById(this.expenseId!).subscribe({
      next: (response: any) => {
        if (response.success) {
          const expense = response.data;
          const date = new Date(expense.date).toISOString().split('T')[0];
          this.expenseForm.patchValue({
            description: expense.description,
            amount: expense.amount,
            date: date,
            categoryId: expense.categoryId,
            loanId: expense.loanId || null
          });
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load expense';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.expenseForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = {
      ...this.expenseForm.value,
      date: new Date(this.expenseForm.value.date),
      loanId: this.expenseForm.value.loanId || null
    };

    if (this.isEditMode && this.expenseId) {
      this.expenseService.update(this.expenseId, { id: this.expenseId, ...formValue }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Expense updated successfully';
            setTimeout(() => this.router.navigate(['/expenses']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to update expense';
          this.submitting = false;
        }
      });
    } else {
      this.expenseService.create(formValue).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Expense added successfully';
            setTimeout(() => this.router.navigate(['/expenses']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to add expense';
          this.submitting = false;
        }
      });
    }
  }

  get f() { return this.expenseForm.controls; }
}