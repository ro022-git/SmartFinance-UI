export interface Income {
  id: number;
  amount: number;
  source: string;
  date: Date;
  categoryId: number;
  categoryName: string;
  createdAt: Date;
}

export interface CreateIncomeDto {
  amount: number;
  source: string;
  date: Date;
  categoryId: number;
}

export interface UpdateIncomeDto {
  id: number;
  amount: number;
  source: string;
  date: Date;
  categoryId: number;
}