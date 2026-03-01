export interface StockMovement {
  _id: string;
  type: 'in' | 'out' | 'adjustment';
  product: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
  };
  quantity: number;
  reason?: string;
  date: string;
  createdBy?: {
    prenom: string;
    nom: string;
  };
}

export interface StockEntry {
  product: string;
  quantity: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  expiryDate?: string | null;
  reason?: string;
}