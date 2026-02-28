import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/user.model';
import { Observable } from 'rxjs';
import { CreateCategoryDto, ICategory, UpdateCategoryDto } from '../models/category.model'

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7292/api/Category';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<ICategory[]>> {
    return this.http.get<ApiResponse<ICategory[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<ICategory>> {
    return this.http.get<ApiResponse<ICategory>>(`${this.apiUrl}/${id}`);
  }

  getByType(type: string): Observable<ApiResponse<ICategory[]>> {
    return this.http.get<ApiResponse<ICategory[]>>(`${this.apiUrl}/type/${type}`);
  }

  create(category: CreateCategoryDto): Observable<ApiResponse<ICategory>> {
    return this.http.post<ApiResponse<ICategory>>(this.apiUrl, category);
  }

  update(id: number, category: UpdateCategoryDto): Observable<ApiResponse<ICategory>> {
    return this.http.put<ApiResponse<ICategory>>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}