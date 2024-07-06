import { IPost } from "./post";
import { Colors } from "./user";

export interface ICommunity {
  id: number;
  name: string;
  image_url: string;
  description: null | string;
  user_id: number;
  profileColor: Colors;
  createdAt: Date;
  updatedAt: Date;
  posts: IPost[];
  user: {
    username: string;
    image_url?: string | null;
  };
}
