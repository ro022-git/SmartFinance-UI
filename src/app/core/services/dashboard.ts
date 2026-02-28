import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryBreakdown, DashboardSummary, MonthlySummary, RecentTransaction } from '../models/dashboard.model';
import { ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://localhost:7292/api/Dashboard';

  constructor(private http: HttpClient) { }

  getSummary(year?: number, month?: number): Observable<ApiResponse<DashboardSummary>> {
    let url = `${this.apiUrl}/summary`;
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);
    if (params.length) url += `?${params.join('&')}`;

    return this.http.get<ApiResponse<DashboardSummary>>(url);
  }

  getByDateRange(start: Date, end: Date): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${this.apiUrl}/by-date-range?start=${start.toISOString()}&end=${end.toISOString()}`
    );
  }

  getMonthlyBreakdown(year: number): Observable<ApiResponse<MonthlySummary[]>> {
    return this.http.get<ApiResponse<MonthlySummary[]>>(`${this.apiUrl}/monthly/${year}`);
  }

  getTopCategories(type: 'income' | 'expense', count: number = 5): Observable<ApiResponse<CategoryBreakdown[]>> {
    return this.http.get<ApiResponse<CategoryBreakdown[]>>(
      `${this.apiUrl}/top-categories?type=${type}&count=${count}`
    );
  }

  getRecentTransactions(count: number = 10): Observable<ApiResponse<RecentTransaction[]>> {
    return this.http.get<ApiResponse<RecentTransaction[]>>(`${this.apiUrl}/recent-transactions?count=${count}`);
  }
}