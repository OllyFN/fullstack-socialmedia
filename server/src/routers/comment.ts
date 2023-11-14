import express, { Request, Response } from "express";
import { pool } from "../server";
import { ResultSetHeader } from "mysql2";
import { queryReturnValue } from "../types";
const router = express.Router();

router.post("/:postId", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;
  const userId = req.user.user_id;

  // Validate the comment data
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
    const [result] = await pool.query("CALL CreateComment(?, ?, ?)", [
      postId,
      userId,
      content,
    ]);
    res.status(201).send({ commentId: (result as ResultSetHeader).insertId });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

// # DELETE /comments/:commentId
router.delete("/:commentId", async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const [rows]: any = await pool.query("CALL DoesCommentExist(?)", [
      commentId,
    ]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    await pool.query("CALL DeleteComment(?)", [commentId]);
    res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post("/:commentId/reply", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.user.user_id;

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

// # PUT /comments/:commentId
router.put("/comments/:commentId", async (req: Request, res: Response) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.user.user_id;

  // Validate the comment data
  if (!content) {
    return res.status(400).send("Content is required");
  }

  if (content.length > 255) {
    return res.status(400).send("Content is too long");
  }

  try {
    const [rows]: any = await pool.query("CALL GetCommentOwner(?)", [
      commentId,
    ]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    if (rows[0][0].user_id !== userId) {
      return res.status(403).send("You are not the owner of this comment");
    }

    await pool.query("CALL UpdateComment(?, ?)", [commentId, content]);
    res.status(200).send({ commentId });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

// # GET /comments/:commentId
router.get("/comments/:commentId", async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const [rows]: any = await pool.query("CALL GetComment(?)", [commentId]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    const comment = rows[0][0];
    res.status(200).send({ comment });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get("/:postId/comments", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { page, limit, sort } = req.query;

  // Convert page and limit to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const [rows]: any = await pool.query("CALL GetPostComments(?, ?, ?, ?)", [
      postId,
      offset,
      limitNumber,
      sort,
    ]);
    if (rows[0].length === 0) {
      return res.sendStatus(404);
    }

    res.status(200).send(rows[0]);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post("/:postId/comments", async (req: Request, res: Response) => {
  const content = req.body.content;
  const postId = req.params.postId;
  const userId = req.user.user_id;

  // Validate the comment data
  if (!userId) {
    return res.status(400).send("Token has no User ID");
  }

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

    const [result] = await pool.query("CALL CreateComment(?, ?, ?)", [
      postId,
      userId,
      content,
    ]);
    res.status(201).send({ commentId: (result as ResultSetHeader).insertId });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
