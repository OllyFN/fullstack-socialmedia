import { FieldPacket, RowDataPacket } from "mysql2";

export interface JWTPayload {
  user_id: number;
  name: string;
  pass: string;
}

export interface User {
  user_id: number;
  joined: Date;
  name: string;
  pass: string;
  email: string;
  avatar: string;
}

export interface Follower {
  user_id: number;
  follower_id: number;
}

export interface Following {
  user_id: number;
  following_id: number;
}

export interface Post {
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostUpdate {
  postUpdateId: number;
  postId: number;
  content: string;
  updatedAt: Date;
}

export type queryReturnValue = [RowDataPacket[], FieldPacket[]];
