
export interface Comment {
  _id: string;
  content: string;
  commentCreator: {
    photo: string;
    _id: string;
    name: string;
    username: string;
  };
  photo: string;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
  image?: string;
  replies?: Comment[];
}
export interface PostDetails {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: string;
  user: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  sharedPost: PostDetails | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: Comment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked: boolean;
}
