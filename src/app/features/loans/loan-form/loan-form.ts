import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoanService } from '../../../core/services/loan';

@Component({
  selector: 'app-loan-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css',
})
export class LoanForm implements OnInit{
  loanForm: FormGroup;
  
  isEditMode = false;
  loanId: number | null = null;
  
  loading = false;
  submitting = false;
  error = '';
  success = '';
  submitted = false;
today: any;

  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.loanForm = this.formBuilder.group({
      lenderName: ['', [Validators.required, Validators.minLength(2)]],
      totalAmount: ['', [Validators.required, Validators.min(1)]],
      dueDate: [today, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loanId = +id;
      this.loadLoan();
    }
  }

  loadLoan() {
    this.loading = true;
    this.loanService.getById(this.loanId!).subscribe({
      next: (response: any) => {
        if (response.success) {
          const loan = response.data;
          const dueDate = new Date(loan.dueDate).toISOString().split('T')[0];
          this.loanForm.patchValue({
            lenderName: loan.lenderName,
            totalAmount: loan.totalAmount,
            dueDate: dueDate
          });
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load loan';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.loanForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = {
      ...this.loanForm.value,
      dueDate: new Date(this.loanForm.value.dueDate)
    };

    if (this.isEditMode && this.loanId) {
      this.loanService.update(this.loanId, { id: this.loanId, ...formValue }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Loan updated successfully';
            setTimeout(() => this.router.navigate(['/loans']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to update loan';
          this.submitting = false;
        }
      });
    } else {
      this.loanService.create(formValue).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Loan added successfully';
            setTimeout(() => this.router.navigate(['/loans']), 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: () => {
          this.error = 'Failed to add loan';
          this.submitting = false;
        }
      });
    }
  }

  validateAmount() {
    const amount = this.loanForm.get('totalAmount')?.value;
    if (amount && amount < 0) {
      this.loanForm.get('totalAmount')?.setErrors({ negative: true });
    }
  }

  get f() { return this.loanForm.controls; }
}