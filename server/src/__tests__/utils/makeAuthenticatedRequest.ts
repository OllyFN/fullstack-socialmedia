import request from "supertest";
import { app } from "../../server"; // replace './app' with the path to your Express application

async function makeAnyRequest(
  method: "get" | "post" | "put" | "delete",
  url: string,
  body: any,
  auth: boolean,
  credentials?: { name: string; pass: string }
): Promise<request.Test> {
  // Login and get the token
  let token;
  console.log(body);
  if (auth) {
    const loginResponse = await request(app)
      .post("/users/login")
      .send(credentials);
    token = loginResponse.text;
  }
  // Make the request
  let req;
  switch (method) {
    case "get":
      req = request(app).get(url);
      break;
    case "post":
      req = request(app).post(url);
      break;
    case "put":
      req = request(app).put(url);
      break;
    case "delete":
      req = request(app).delete(url);
      break;
    default:
      throw new Error(`Invalid method: ${method}`);
  }

  if (auth) {
    // Set the Authorization header
    req.set("Authorization", `Bearer ${token}`);
  }
  // Send the body, if provided
  if (body) {
    req.send(body);
  }

  // Return the response
  return req;
}

export const makeAuthenticatedRequest = (
  method: "get" | "post" | "put" | "delete",
  url: string,
  body: any,
  credentials?: { name: string; pass: string }
) => makeAnyRequest(method, url, body, true, credentials);
export const makeUnauthenticatedRequest = (
  method: "get" | "post" | "put" | "delete",
  url: string,
  body?: any
) => makeAnyRequest(method, url, body, false);
