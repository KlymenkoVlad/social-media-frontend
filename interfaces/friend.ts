export interface IFriend {
  friend: {
    id: number;
    imageUrl: string | null;
    name: string;
    username: string;
  };
  friendId: number;
  id: number;
  userId: number;
}
