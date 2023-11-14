import express from "express";
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import reactionRouter from "./routers/reaction";
import reportRouter from "./routers/report";
import commentRouter from "./routers/comment";
//import { applyRateLimits } from "./rateLimiter";

dotenv.config();

export const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//applyRateLimits(app);

/*
  TODO: Add trafic queues to the api which will be used to track trafic of posts, comments and profiles and will be used to determine trending posts, comments and profiles aswell as lower the amount of updates to the profile as updating the api 500 times per minute just for a single post cause its getting loads of likes & comments is a waste reduced to 12 updates per minute by adding a 5s queue to the api which will be used to update the profile every 5s instead of every time a post or comment is liked or commented on.

  TODO: Add the authenticate middleware to all routes that require authentication
*/

/*
  ! As of now im unsure how I want to do fetch posts, since fetching posts from the database will just get the posts in order of when they were created, not personalized to the user.
*/

// POST /report/:type(post|comment)/:id
// Creates a new report on a post or comment. The user ID is taken from the JWT in the request, the type of the target (post or comment) and the ID of the target are taken from the URL parameters, and the reason for the report is taken from the request body. If the target does not exist, a 404 status is returned. If the report is successfully created, the ID of the new report is returned in the response.
app.use("/report", reportRouter);

// POST /:postId
// Creates a new comment on a post. The user ID is taken from the JWT in the request, the post ID is taken from the URL parameters, and the content of the comment is taken from the request body.

// DELETE /:commentId
// Deletes a comment by its ID. The comment ID is taken from the URL parameters. If the comment does not exist, a 404 status is returned.

// POST /:commentId/reply
// Creates a new reply to a comment. The user ID is taken from the JWT in the request, the comment ID is taken from the URL parameters, and the content of the reply is taken from the request body. If the comment does not exist, a 404 status is returned.

// PUT /comments/:commentId
// Updates a comment by its ID. The user ID is taken from the JWT in the request, the comment ID is taken from the URL parameters, and the new content of the comment is taken from the request body. If the comment does not exist or the user is not the owner of the comment, a 404 or 403 status is returned, respectively.

// GET /comments/:commentId
// Retrieves a comment by its ID. The comment ID is taken from the URL parameters. If the comment does not exist, a 404 status is returned.

// GET /:postId/comments
// Retrieves the comments on a post. The post ID is taken from the URL parameters, and the page number, page size, and sort order are taken from the query parameters. If the post does not exist, a 404 status is returned.

// POST /:postId/comments
// Creates a new comment on a post. The user ID is taken from the JWT in the request, the post ID is taken from the URL parameters, and the content of the comment is taken from the request body. If the post does not exist, a 404 status is returned.
app.use("/comment", commentRouter);

// POST /reaction/:type(post|comment)/:id/:action(like|dislike)
// Adds a like or dislike reaction to a post or comment. The user ID is taken from the JWT in the request, and the type of the target (post or comment), the ID of the target, and the action (like or dislike) are taken from the URL parameters. If the user has already reacted to the target with the same action, a 409 status is returned.

// DELETE /reaction/:type(post|comment)/:id/:action(like|dislike)
// Removes a like or dislike reaction from a post or comment. The user ID is taken from the JWT in the request, and the type of the target (post or comment), the ID of the target, and the action (like or dislike) are taken from the URL parameters. If the user has not reacted to the target, a 404 status is returned.
app.use("/reaction", reactionRouter);

// POST /users/register
// Registers a new user. The username, password, email, and avatar are taken from the request body. The password is hashed before it is stored. A JWT is returned in the response.

// POST /users/login
// Logs in a user. The username and password are taken from the request body. The password is compared with the hashed password in the database. If the passwords match, a JWT is returned in the response.

// GET /users/:userId/following/posts
// Retrieves the posts of the users that the specified user is following. The user ID is taken from the URL parameters.

// PUT /users/:userId
// Updates the profile of a user. The user ID is taken from the URL parameters, and the new username, password, email, and avatar are taken from the request body. If the password has changed, it is hashed before it is stored.
app.use("/users", userRouter);

// POST /posts
// Creates a new post. The user ID is taken from the JWT in the request, and the content of the post is taken from the request body.

// GET /posts/:postId
// Retrieves a post by its ID. The post ID is taken from the URL parameters.

// DELETE /posts/:postId
// Deletes a post by its ID. The post ID is taken from the URL parameters, and the user ID is taken from the JWT in the request.
// Only the owner of the post can delete it.

// PUT /posts/:postId
// Updates a post by its ID. The post ID is taken from the URL parameters, the user ID is taken from the JWT in the request, and the new content of the post is taken from the request body.
// Only the owner of the post can update it.
app.use("/posts", postRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(8080, () => {
    console.log("Socialmedia REST api listening on port 8080!");
  });
}
