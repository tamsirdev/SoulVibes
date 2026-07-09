export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'seller' | 'admin';
  created_at: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}
