import express, { Request, Response } from "express";
import { pool } from "../server";
import { queryReturnValue } from "../types";
import authenticateJWT from "../utils/middleware/authenticate";
import noGuests from "../utils/middleware/noGuests";
const router = express.Router();

// POST /reaction/:type(post|comment)/:id/:action(like|dislike)
router.post(
  "/:type(post|comment)/:id/:action(like|dislike)",
  authenticateJWT,
  noGuests,
  async (req: Request, res: Response) => {
    const userId = req.user.user_id;
    const { id, type, action } = req.params;

    if (!userId) {
      return res.sendStatus(400);
    }

    const likeType = action === "like" ? 1 : -1;
    try {
      const [rows]: queryReturnValue = await pool.query(
        "CALL Get" + type + "LikeState(?, ?)",
        [userId, id]
      );
      if (rows[0].length > 0 && rows[0][0].like_type === likeType) {
        return res.sendStatus(409);
      }

      await pool.query("CALL Update" + type + "LikeState(?, ?, ?)", [
        userId,
        id,
        likeType,
      ]);
      return res.sendStatus(200);
    } catch (err: any) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
);

// DELETE /action/:type(post|comment)/:id/:action(like|dislike)
router.delete(
  "/:type(post|comment)/:id/:action(like|dislike)",
  async (req: Request, res: Response) => {
    const userId = req.user.user_id;
    const { id, type } = req.params;

    if (!userId) {
      return res.sendStatus(400);
    }

    try {
      const [rows]: queryReturnValue = await pool.query(
        "CALL Get" + type + "LikeState(?, ?)",
        [userId, id]
      );

      if (rows[0].length === 0) {
        return res.sendStatus(404);
      }

      await pool.query("CALL Update" + type + "LikeState(?, ?, 0)", [
        userId,
        id,
      ]);
      return res.sendStatus(200);
    } catch (err: any) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
);

export default router;
