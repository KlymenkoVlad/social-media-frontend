export enum Colors {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  PURPLE = "PURPLE",
  PINK = "PINK",
  GRAY = "GRAY",
}

export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  surname?: string;
  age?: number;
  profileColor: Colors;
  image_url?: string;
  description?: string;
  password: string;
}
