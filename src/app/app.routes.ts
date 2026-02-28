import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(c => c.Register)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(c => c.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/category-list/category-list').then(c => c.CategoryList),
    canActivate: [authGuard]
  },
  {
    path: 'categories/add',
    loadComponent: () => import('./features/categories/category-form/category-form').then(c => c.CategoryForm),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./features/categories/category-form/category-form').then(c => c.CategoryForm),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'incomes',
    loadComponent: () => import('./features/incomes/income-list/income-list').then(c => c.IncomeList),
    canActivate: [authGuard]
  },
  {
    path: 'incomes/add',
    loadComponent: () => import('./features/incomes/income-form/income-form').then(c => c.IncomeForm),
    canActivate: [authGuard]
  },
  {
    path: 'incomes/edit/:id',
    loadComponent: () => import('./features/incomes/income-form/income-form').then(c => c.IncomeForm),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'expenses',
    loadComponent: () => import('./features/expenses/expense-list/expense-list').then(c => c.ExpenseList),
    canActivate: [authGuard]
  },
  {
    path: 'expenses/add',
    loadComponent: () => import('./features/expenses/expense-form/expense-form').then(c => c.ExpenseForm),
    canActivate: [authGuard]
  },
  {
    path: 'expenses/edit/:id',
    loadComponent: () => import('./features/expenses/expense-form/expense-form').then(c => c.ExpenseForm),
    canActivate: [authGuard]
  },
{
  path: 'loans',
  loadComponent: () => import('./features/loans/loan-list/loan-list').then(c => c.LoanList),
  canActivate: [authGuard]
},
{
  path: 'loans/add',
  loadComponent: () => import('./features/loans/loan-form/loan-form').then(c => c.LoanForm),
  canActivate: [authGuard]
},
{
  path: 'loans/edit/:id',
  loadComponent: () => import('./features/loans/loan-form/loan-form').then(c => c.LoanForm),
  canActivate: [authGuard]
},
{
  path: 'loans/:id/payments',
  loadComponent: () => import('./features/loans/loan-payments/loan-payments').then(c => c.LoanPayments),
  canActivate: [authGuard]
},
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
