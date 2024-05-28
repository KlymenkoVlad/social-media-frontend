export interface ILike {
  id: number;
  user_id: number;
  post_id: number;
}

export interface IComment {
  id: number;
  text: string;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at: Date;
  user: {
    username: string;
  };
}

export interface IPost {
  id: number;
  title?: string;
  text: string;
  image_url?: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  likes: [];
  comments: [];
  user: {
    username: string;
  };
}
