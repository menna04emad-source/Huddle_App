export interface TopComment {
  _id: string;
  content: string;
  commentCreator: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  createdAt: string;
}
export interface Post {
  _id: string;
  image: string;
  privacy: string;
  body: string;
  user: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  sharedPost: Post | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}