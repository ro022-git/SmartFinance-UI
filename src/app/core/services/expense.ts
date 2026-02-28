import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/user.model';
import { CreateExpenseDto, IExpense, UpdateExpenseDto } from '../models/expense.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'https://localhost:7292/api/Expense';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<IExpense[]>> {
    return this.http.get<ApiResponse<IExpense[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<IExpense>> {
    return this.http.get<ApiResponse<IExpense>>(`${this.apiUrl}/${id}`);
  }

  getByDateRange(start: Date, end: Date): Observable<ApiResponse<IExpense[]>> {
    return this.http.get<ApiResponse<IExpense[]>>(
      `${this.apiUrl}/date-range?start=${start.toISOString()}&end=${end.toISOString()}`
    );
  }

  getByCategory(categoryId: number): Observable<ApiResponse<IExpense[]>> {
    return this.http.get<ApiResponse<IExpense[]>>(`${this.apiUrl}/category/${categoryId}`);
  }

  getByLoan(loanId: number): Observable<ApiResponse<IExpense[]>> {
    return this.http.get<ApiResponse<IExpense[]>>(`${this.apiUrl}/loan/${loanId}`);
  }

  getTotal(start?: Date, end?: Date): Observable<ApiResponse<number>> {
    let url = `${this.apiUrl}/total`;
    if (start && end) {
      url += `?start=${start.toISOString()}&end=${end.toISOString()}`;
    }
    return this.http.get<ApiResponse<number>>(url);
  }

  create(expense: CreateExpenseDto): Observable<ApiResponse<IExpense>> {
    return this.http.post<ApiResponse<IExpense>>(this.apiUrl, expense);
  }

  update(id: number, expense: UpdateExpenseDto): Observable<ApiResponse<IExpense>> {
    return this.http.put<ApiResponse<IExpense>>(`${this.apiUrl}/${id}`, expense);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}