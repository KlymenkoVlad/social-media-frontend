export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  surname?: string;
  age?: number;
  imageUrl?: string;
  description?: string;
  password: string;
}
