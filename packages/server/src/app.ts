import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { defaultConfig } from './config/default';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson  from 'superjson';

dotenv.config({ path: path.join(__dirname, './.env') });

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

const appRouter = t.router({
  sayHello: t.procedure.query(async () => {

    return { message: 'HELLOO THERE' };
  }),
});

export type AppRouter = typeof appRouter;

const app = express();
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cors({
  origin: [defaultConfig.origin, 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = defaultConfig.port;

app.listen(port, () => {
  console.log(`🚀🚀🚀 Server listening on port ${port} 🚀🚀🚀`);
});
