export interface ICategory {
  id: number;
  name: string;
  type: 'Income' | 'Expense';
  createdAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  type: 'Income' | 'Expense';
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
}