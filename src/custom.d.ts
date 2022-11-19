declare namespace Express {
  export interface Request {
    payload?: import('./types').Payload;
  }
}
