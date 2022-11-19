import express, { Request, Response, NextFunction } from 'express';
import { Payload } from './types';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());

let refreshTokens: string[] = [];

app.post('/login', (req: Request, res: Response) => {
  // TODO authenticate user

  const payload: Payload = { name: req.body.username };
  const accessToken: string = generateAccessToken(payload);
  const refreshToken: string = generateRefreshtoken(payload);
  refreshTokens.push(refreshToken);

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

const generateAccessToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.SECRET_KEY_TOKEN!, { expiresIn: '30s' });
};

const generateRefreshtoken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN!);
};

app.post('/token', (req: Request, res: Response): Response | void => {
  const refreshToken: string = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.SECRET_KEY_REFRESH_TOKEN!,
    (err, payload) => {
      if (err) return res.sendStatus(403);
      const { name }: Payload = payload as Payload;
      const accessToken = generateAccessToken({ name });
      return res.json({ accessToken: accessToken });
    }
  );
});

app.listen(4000);
