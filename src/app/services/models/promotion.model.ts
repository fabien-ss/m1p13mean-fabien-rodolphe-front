
import { Product } from "./product.models";

export interface Promotion {
  _id?: string;
  product: string; // Product ID
  title: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string or null
  createdBy: string; // User ID of the creator
}