import express, { Express } from 'express';
import { env } from '@/config/env';
import { errorHandler } from './middlewares/errorHandler';
import { router as routes } from './routes';
import cors from 'cors';

const app: Express = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export const startServer = async () => {
  return new Promise<void>((resolve) => {
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`http://localhost:${env.PORT}`);
      resolve();
    });
  });
};

export default app;
