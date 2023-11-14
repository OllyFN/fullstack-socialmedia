import express, { Request, Response } from "express";
import { pool } from "../server";
import { ResultSetHeader } from "mysql2";
const router = express.Router();

router.post("/:commentId", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.user?.user_id;

  // Validate the reply data
  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  if (!content) {
    return res.status(400).send("Content is required");
  }

  if (content.length > 255) {
    return res.status(400).send("Content is too long");
  }

  try {
    const [rows]: any = await pool.query("CALL DoesCommentExist(?)", [
      commentId,
    ]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    const [result] = await pool.query("CALL CreateReply(?, ?, ?)", [
      commentId,
      userId,
      content,
    ]);
    res.status(201).send({ replyId: (result as ResultSetHeader).insertId });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

// PUT /reply/:replyId
router.put("/:replyId", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { replyId } = req.params;
  const userId = req.user?.user_id;

  // Validate the reply data
  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  if (!content) {
    return res.status(400).send("Content is required");
  }

  if (content.length > 255) {
    return res.status(400).send("Content is too long");
  }

  try {
    const [rows]: any = await pool.query("CALL DoesReplyExist(?)", [replyId]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    await pool.query("CALL UpdateReply(?, ?, ?)", [replyId, userId, content]);
    res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

// DELETE /reply/:replyId
router.delete("/:replyId", async (req: Request, res: Response) => {
  const { replyId } = req.params;
  const userId = req.user?.user_id;

  // Validate the reply data
  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const [rows]: any = await pool.query("CALL DoesReplyExist(?)", [replyId]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    await pool.query("CALL DeleteReply(?, ?)", [replyId, userId]);
    res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
