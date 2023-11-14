import express, { Request, Response } from "express";
import { pool } from "../server";
import { RowDataPacket } from "mysql2";
import authenticateJWT from "../utils/middleware/authenticate";
import noGuests from "../utils/middleware/noGuests";
const router = express.Router();

// # POST /report/:type(post|comment)/:id
router.post(
  "/:type(post|comment)/:id",
  authenticateJWT,
  noGuests,
  async (req: Request, res: Response) => {
    const { reason } = req.body;
    const reporterId = req.user.user_id;
    const { id, type } = req.params;

    // Validate the report data
    if (!reason) {
      return res.status(400).send("Reason is required");
    }

    // Validate the id, regex checks if the id consists any chars which are not digits
    if (!/^\d+$/.test(id)) {
      return res.status(404).send("ID must be a string of digits");
    }

    try {
      const [rows]: any = await pool.query(`CALL Does${type}Exist(?)`, [id]);
      if (rows[0].length === 0) {
        return res.sendStatus(404);
      }
      const [result] = (await pool.query("CALL CreateReport(?, ?, ?, ?)", [
        id,
        reason,
        reporterId,
        type,
      ])) as RowDataPacket[][];
      return res.status(201).send({ reportId: result[0][0].reportId });
    } catch (err: any) {
      return res.sendStatus(500);
    }
  }
);

export default router;
