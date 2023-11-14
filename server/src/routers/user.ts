import express, { Request, Response } from "express";
import { pool } from "../server";
import bcrypt from "bcrypt";
import validateEmail from "../utils/validation/validateEmail";
import validateUsername from "../utils/validation/validateUsername";
import getUserByName from "../utils/sql/getUserByName";
import { User, queryReturnValue } from "../types";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import authenticateJWT from "../utils/middleware/authenticate";
const router = express.Router();

interface MySQLError extends Error {
  errno?: number;
}

function handleError(res: Response, err: MySQLError): void {
  if (err.errno === 1062) {
    res.status(400).send("Username or email already exists");
  } else {
    res.status(500).send("Error: " + err);
  }
}
// /users/register
const saltRounds = 10;
router.post("/register", async (req: Request, res: Response) => {
  const { name, pass, email, avatar } = req.body;

  if (!name || !pass || !email || !avatar) {
    console.dir(req.body);

    return res
      .status(400)
      .send("Name, password, email, and avatar are required");
  }

  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email");
  }

  if (!validateUsername(name)) {
    return res.status(400).send("Invalid username");
  }

  const hashedPassword: string = await bcrypt.hash(pass, saltRounds);

  try {
    const checkQuery = `
    SELECT name, email FROM users WHERE name = ? OR email = ?;
  `;
    const [existingUsers] = await pool.query<
      { name: string; email: string }[] & RowDataPacket[][]
    >(checkQuery, [name, email]);

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.name === name) {
        return res.status(400).send("User with this name already exists");
      }
      if (existingUser.email === email) {
        return res.status(400).send("User with this email already exists");
      }
    }

    const insertQuery = `
    INSERT INTO users(name, pass, email, avatar, joined)
    VALUES (?, ?, ?, ?, NOW());
    `;

    const [insertResult] = await pool.query<ResultSetHeader>(insertQuery, [
      name,
      hashedPassword,
      email,
      avatar,
    ]);

    const userId = insertResult.insertId;

    const token = jwt.sign(
      { user_id: userId, name: name, avatar: avatar },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    return res.status(201).send({
      token,
      userId,
    });
  } catch (err: any) {
    return handleError(res, err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { name, pass } = req.body;

  if (!name || !pass) {
    return res.status(400).send("Name and password are required");
  }

  if (!validateUsername(name)) {
    return res.status(400).send("Invalid username");
  }

  const user: User | null = await getUserByName(name).catch((err) => {
    handleError(res, err);
    res.status(500).send("An error occurred");
    return null;
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const match: boolean = await bcrypt.compare(pass, user.pass);

  if (match) {
    const token = jwt.sign(
      { user_id: user.user_id, name: user.name, avatar: user.avatar },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).send(token);
  } else {
    return res.status(400).send("Invalid password");
  }
});

router.get("/:userId/following/posts", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [rows]: queryReturnValue = await pool.query(
      "CALL GetFollowedUsersPosts(?)",
      [userId]
    );
    return res.status(200).json(rows);
  } catch (err: any) {
    return handleError(res, err);
  }
});

// # PUT /users/:userId
router.put("/:userId", authenticateJWT, async (req: Request, res: Response) => {
  if (req.user.user_id !== parseInt(req.params.userId)) {
    console.log(req.user.user_id, req.params.userId);
    return res.status(403).send("Unauthorized");
  }

  const { userId } = req.params;
  const { name, pass, email, avatar } = req.body;

  if (!name || !pass || !email || !avatar) {
    return res
      .status(400)
      .send("Name, password, email, and avatar are required");
  }

  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email");
  }

  if (!validateUsername(name)) {
    return res.status(400).send("Invalid username");
  }

  const checkQuery = `
    SELECT name, email FROM users WHERE name = ? OR email = ?;
  `;
  const [existingUsers] = await pool.query<
    { name: string; email: string }[] & RowDataPacket[][]
  >(checkQuery, [name, email]);

  if (existingUsers.length > 0) {
    const existingUser = existingUsers[0];
    if (existingUser.name === name) {
      return res.status(400).send("User with this name already exists");
    }
    if (existingUser.email === email) {
      return res.status(400).send("User with this email already exists");
    }
  }

  const [userPass] = await pool.query<{ pass: string }[] & RowDataPacket[][]>(
    "SELECT pass FROM users WHERE user_id = ?",
    [userId]
  );

  console.log(userPass[0].pass);
  const passwordChanged = !(await bcrypt.compare(pass, userPass[0].pass));

  let hashedPassword: string;
  if (passwordChanged) {
    hashedPassword = await bcrypt.hash(pass, saltRounds);
  } else {
    hashedPassword = req.user.pass;
  }

  try {
    await pool.query(
      "UPDATE users SET name = ?, pass = ?, email = ?, avatar = ? WHERE user_id = ?",
      [name, hashedPassword, email, avatar, userId]
    );
    return res.status(200).send(userId);
  } catch (err: any) {
    console.log(err);
    return handleError(res, err);
  }
});

export default router;
