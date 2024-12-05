import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT ?? 8080;
const host = process.env.HOST ?? 'localhost';
const scheme = process.env.SCHEME ?? 'http';

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});


import { Controller } from 'lib/http/Controller';

new Controller();

app.listen(port, () => {
    console.log(`[server]: Server is running at ${scheme}://${host}:${port}`);
});
