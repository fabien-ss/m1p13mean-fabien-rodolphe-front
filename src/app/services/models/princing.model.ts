export interface Pricing {
  _id?: string;
  product: string;
  costPrice: number;
  sellingPrice: number;
  startDate?: string | Date;
  endDate?: string | Date | null;
  createdBy?: string;
}

export interface CreatePricing {
  product: string;
  sellingPrice: number;
  costPrice?: number;
  startDate?: string | null;
  endDate?: string | null;
  note?: string | null;
}