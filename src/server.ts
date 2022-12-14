import express, { Request, Response, NextFunction } from 'express';
import { Post, Payload } from './types';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());

const posts: Post[] = [
  { username: 'Srecko', title: 'Tesna Koza 1' },
  { username: 'Soic', title: 'Tesna Koza 2' },
];

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1]; // Bearer Token

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY_TOKEN!, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.payload = payload as Payload;

    next();
  });
};

app.get('/posts', verifyToken, (req: Request, res: Response) => {
  const { name }: Payload = req.payload as Payload;
  res.json(posts.filter((post) => post.username === name));
});

app.listen(3000);
