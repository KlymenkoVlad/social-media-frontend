export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  surname?: string;
  age?: number;
  image_url?: string;
  description?: string;
  password: string;
}
