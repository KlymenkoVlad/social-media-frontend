import { ICommunity } from "./community";

export interface ILike {
  id: number;
  userId: number;
  postId: number;
}

export interface IComment {
  id: number;
  text: string;
  userId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
    imageUrl: string;
  };
}

export interface IPost {
  id: number;
  title?: string;
  text: string;
  imageUrl?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  likes: ILike[];
  comments: IComment[];
  user: {
    username: string;
    imageUrl: string;
  };
  community: ICommunity;
}
