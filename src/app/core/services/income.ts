import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/user.model';
import { CreateIncomeDto, Income, UpdateIncomeDto } from '../models/income.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'https://localhost:7292/api/Income';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Income>> {
    return this.http.get<ApiResponse<Income>>(`${this.apiUrl}/${id}`);
  }

  getByDateRange(start: Date, end: Date): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(`${this.apiUrl}/date-range?start=${start.toISOString()}&end=${end.toISOString()}`);
  }

  getByCategory(categoryId: number): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(`${this.apiUrl}/category/${categoryId}`);
  }

  getTotal(start?: Date, end?: Date): Observable<ApiResponse<number>> {
    let url = `${this.apiUrl}/total`;
    if (start && end) {
      url += `?start=${start.toISOString()}&end=${end.toISOString()}`;
    }
    return this.http.get<ApiResponse<number>>(url);
  }

  create(income: CreateIncomeDto): Observable<ApiResponse<Income>> {
    return this.http.post<ApiResponse<Income>>(this.apiUrl, income);
  }

  update(id: number, income: UpdateIncomeDto): Observable<ApiResponse<Income>> {
    return this.http.put<ApiResponse<Income>>(`${this.apiUrl}/${id}`, income);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}