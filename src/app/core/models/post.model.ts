export interface Post {
  _id: string;
  body: string;
  image: string;
  user: User;
  createdAt: string;
  comments: Comment[];
  id: string;
}

interface User {
  _id: string;
  name: string;
  photo: string;
}

interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  createdAt: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
}
