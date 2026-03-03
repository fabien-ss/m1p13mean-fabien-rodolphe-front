export interface Shop {
  _id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  manager: {
    _id: string;
    firstName: string;
    name: string;
    image?: string;
    role?: string;
  };
  creationDate: string;
  type?: string;
  images: string[];
  isActive: boolean;
}