import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/user.model';
import { CreateLoanDto, ILoan, LoanSummary, UpdateLoanDto } from '../models/loan.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'https://localhost:7292/api/Loan';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<ILoan[]>> {
    return this.http.get<ApiResponse<ILoan[]>>(this.apiUrl);
  }

  getActive(): Observable<ApiResponse<ILoan[]>> {
    return this.http.get<ApiResponse<ILoan[]>>(`${this.apiUrl}/active`);
  }

  getOverdue(): Observable<ApiResponse<ILoan[]>> {
    return this.http.get<ApiResponse<ILoan[]>>(`${this.apiUrl}/overdue`);
  }

  getSummary(): Observable<ApiResponse<LoanSummary>> {
    return this.http.get<ApiResponse<LoanSummary>>(`${this.apiUrl}/summary`);
  }

  getById(id: number): Observable<ApiResponse<ILoan>> {
    return this.http.get<ApiResponse<ILoan>>(`${this.apiUrl}/${id}`);
  }

  getPayments(id: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${id}/payments`);
  }

  create(loan: CreateLoanDto): Observable<ApiResponse<ILoan>> {
    return this.http.post<ApiResponse<ILoan>>(this.apiUrl, loan);
  }

  update(id: number, loan: UpdateLoanDto): Observable<ApiResponse<ILoan>> {
    return this.http.put<ApiResponse<ILoan>>(`${this.apiUrl}/${id}`, loan);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}