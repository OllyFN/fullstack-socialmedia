import { pool } from "../../server";
import {
  makeAuthenticatedRequest,
  makeUnauthenticatedRequest,
} from "./makeAuthenticatedRequest";

interface CleanupQueueIndexType {
  table: "reports" | "users" | "posts" | "comments" | "reactions";
  id: number;
  idName: string;
}

interface requestOptions {
  body?: any;
  credentials?: { name: string; pass: string };
}

class TestHelper {
  private cleanupQueue: CleanupQueueIndexType[];
  private name: string;
  private pass: string;

  constructor() {
    this.name = "Olly";
    this.pass = "HelloWorld!";
    this.cleanupQueue = [];
  }

  async makeRequest(
    auth: "auth" | "noAuth",
    type: "post" | "get" | "delete" | "put",
    url: string,
    options?: requestOptions
  ) {
    let test;

    options =
      options == undefined || Object.keys(options).length == 0
        ? { credentials: { name: this.name, pass: this.pass } }
        : { credentials: { name: this.name, pass: this.pass }, ...options };

    if (auth == "auth") {
      test = makeAuthenticatedRequest(
        type,
        url,
        options?.body,
        options?.credentials
      );
    } else {
      test = makeUnauthenticatedRequest(type, url, options?.body);
    }

    const response = await test;
    console.log(response.body?.userId);
    return response;
  }

  setCredentials = (name: string, pass: string) => {
    this.name = name;
    this.pass = pass;
  };

  // function made for better readability
  authRequest = async (
    type: "post" | "get" | "delete" | "put",
    url: string,
    options?: requestOptions
  ) => this.makeRequest("auth", type, url, options);

  // function made for better readability
  noAuthRequest = async (
    type: "post" | "get" | "delete" | "put",
    url: string,
    body: any
  ) => this.makeRequest("noAuth", type, url, { body });

  addCleanup(
    table: CleanupQueueIndexType["table"],
    idName: string,
    id: number
  ) {
    this.cleanupQueue.push({ table, idName, id });
  }

  async cleanup() {
    for (var i = 0; i < this.cleanupQueue.length; i++) {
      await pool.query(
        `DELETE FROM ${this.cleanupQueue[i].table} WHERE ${this.cleanupQueue[i].idName} = ?`,
        [this.cleanupQueue[i].id]
      );
    }
  }
}

export default new TestHelper();
