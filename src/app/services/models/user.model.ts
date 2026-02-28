export interface User {
  _id: string;
  firstName: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  creationDate: string;
  isActive: boolean;
  lastlogin?: string;
}