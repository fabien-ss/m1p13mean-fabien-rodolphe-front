import { Category } from "./category.model";

export interface Product {
  _id: string;
  name?: string;
  category?: Category;
  brand?: string;
  sku: string;
  barcode?: string;
  model?: string;
  description?: string;
  costPrice?: number;
  sellingPrice?: number | string;
  stock?: number;
  expiryDate?: string | null;
  isActive?: boolean;
  shop?: string | null;
  images?: string[];
  available?: boolean;
  devise?: string;
  tags?: string[];
  creationDate?: Date;
  modificationDate?: Date | string;
  modifiedBy?: string;
  locked?: number | string;
  minStock?: number | string; 
}

export interface SimpleProduct {
  _id: string;
  name?: string;
  category?: Category;
  brand?: string;
  sku: string;
  barcode?: string;
  model?: string;
  description?: string;
  costPrice?: number;
  sellingPrice?: number | string;
  stock?: number;
  expiryDate?: string | null;
  isActive?: boolean;
  shop?: string | null;
  images?: string[];
  available?: boolean;
  devise?: string;
  tags?: string[];
  creationDate?: Date;
  modificationDate?: Date | string;
  modifiedBy?: string;
  locked?: number | string;
  minStock?: number | string; 
}