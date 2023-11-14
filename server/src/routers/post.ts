import { pool } from "../server";
import express, { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
//import { queryReturnValue } from "../types";
import authenticateJWT from "../utils/middleware/authenticate";
const router = express.Router();

router.post("/", authenticateJWT, async (req: Request, res: Response) => {
  const content = req.body.content;
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).send("User must have a User ID in token");
  }

  // Validate the post data
  if (!content) {
    res.status(400).send("Content is required");
    return;
  }

  if (content.length > 255) {
    res.status(400).send("Content is too long");
    return;
  }

  // Insert the post into the Posts table
  try {
    const [result] = await pool.query("CALL CreatePost(?, ?)", [
      userId,
      content,
    ]);

    // Respond with the ID of the new post
    res.status(201).send({ postId: (result as ResultSetHeader).insertId });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

router.get("/:postId", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("CALL GetPost(?)", [req.params.postId]);

    res.status(201).json(rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

router.delete("/:postId", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).send("User must have a User ID in token");
  }

  try {
    const [rows]: any = await pool.query("CALL GetPostOwner(?)", [postId]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    const postOwner = rows[0][0].user_id;
    if (postOwner !== userId) {
      return res.status(403).send("Unauthorized");
    }

    await pool.query("CALL DeletePost(?)", [postId]);
    res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.put("/:postId", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).send("User must have a User ID in token");
  }

  // Validate the post data
  if (!content) {
    return res.status(400).send("Content is required");
  }

  if (content.length > 255) {
    return res.status(400).send("Content is too long");
  }

  try {
    const [rows]: any = await pool.query("CALL DoesPostExist(?)", [postId]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    await pool.query("CALL UpdatePost(?, ?, ?)", [postId, userId, content]);
    res.status(200).send({ postId });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
