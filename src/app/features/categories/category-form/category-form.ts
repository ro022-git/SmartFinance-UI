import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = '';
submitted: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['Income', Validators.required]
    });
  }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/categories']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategory();
    }
  }

  loadCategory() {
    this.loading = true;
    this.categoryService.getById(this.categoryId!).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categoryForm.patchValue({
            name: response.data.name,
            type: response.data.type
          });
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, {
        id: this.categoryId,
        name: this.categoryForm.value.name
      }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Category updated successfully';
            setTimeout(() => {
              this.router.navigate(['/categories']);
            }, 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (err) => {
          this.error = 'Failed to update category';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.categoryService.create(this.categoryForm.value).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.success = 'Category created successfully';
            setTimeout(() => {
              this.router.navigate(['/categories']);
            }, 1500);
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (err) => {
          this.error = 'Failed to create category';
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }

  get f() { return this.categoryForm.controls; }
}
