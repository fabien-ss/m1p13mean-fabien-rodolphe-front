export interface Movement {
  _id?: string;
  id?: string;
  type: 'in' | 'out' | 'adjustment';
  product: {
    _id?: string;
    name: string;
    sku: string;
    image?: string;
    images?: string[];
  };
  quantity: number;
  costPrice?: number;
  sellingPrice?: number;
  expiryDate?: string | null;
  date: string | Date;
  note?: string;
  reason?: string;
  createdBy?: {
    prenom: string;
    nom: string;
  };
}