import { IPost } from "./post";
import { Colors } from "./user";

export interface ISubscription {
  id: number;
  communityId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    imageUrl: null | string;
    id: number;
    username: string;
  };
}

export interface ICommunity {
  id: number;
  name: string;
  imageUrl: string;
  description: null | string;
  userId: number;
  profileColor: Colors;
  createdAt: Date;
  updatedAt: Date;
  posts: IPost[];
  user: {
    username: string;
    imageUrl?: string | null;
  };
  subscribed: ISubscription[];
}
