declare namespace Express {
  export interface Request {
    user: {
      user_id: number;
      name: string;
      pass: string;
    };
    guest: boolean;
  }
}
