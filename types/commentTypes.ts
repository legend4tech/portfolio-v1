import { ObjectId } from "mongodb";

export interface CommentTypes {
  _id: string;
  name: string;
  message: string;
  time_posted: string;
  avatar: string | null;
}

export interface CommentDocument {
  _id: ObjectId;
  name: string;
  message: string;
  time_posted: string;
  avatar: string | null;
}
