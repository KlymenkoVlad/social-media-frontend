export interface IFriend {
  friend: {
    id: number;
    image_url: string | null;
    name: string;
    username: string;
  };
  friendId: number;
  id: number;
  userId: number;
}
