import { pool } from "./server";
import { queryReturnValue } from "./types";

export async function createUser(
  name: string,
  pass: string,
  email: string,
  avatar: string
): Promise<number> {
  const [rows]: queryReturnValue = await pool.query(
    "CALL CreateUser(?, ?, ?, ?, @p_user_id); SELECT @p_user_id",
    [name, pass, email, avatar]
  );
  return rows[0]["@p_user_id"] as number;
}

export async function followUser(
  userId: number,
  otherUserId: number
): Promise<void> {
  await pool.query("CALL FollowUser(?, ?)", [userId, otherUserId]);
}

export async function createPost(
  userId: number,
  content: string
): Promise<number> {
  const [rows]: queryReturnValue = await pool.query(
    "CALL CreatePost(?, ?, @p_post_id); SELECT @p_post_id",
    [userId, content]
  );
  return rows[0]["@p_post_id"] as number;
}
