export interface Category {
  _id: string;
  name: string;
  parent?:  {
    _id: string;
    name: string;
  } | null;
  description?: string;
  isActive: boolean;
}
