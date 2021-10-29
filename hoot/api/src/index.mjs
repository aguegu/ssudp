import cors from 'cors';
import lowdb from 'lowdb';
import config from 'config';
import express from 'express';
import winston from 'winston';
import { createServer } from 'http';
import expressWinston from 'express-winston';
import { createTerminus } from '@godaddy/terminus';
import FileAsync from 'lowdb/adapters/FileAsync.js';

import './logger.mjs';
import api from './api/index.mjs';
import { AppError } from './errors.mjs';

const logger = winston.loggers.get('main');

const teardownServer = async () => {
  logger.info('server teardown');
  logger.end();
};

const initServer = async () => {
  const app = express();

  const db = await lowdb(new FileAsync(config.get('db')));

  app.use(cors());
  app.use(express.json());
  app.use(expressWinston.logger({ winstonInstance: logger }));

  app.use('/api', await api({ db }));

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    /* istanbul ignore else */
    if (err instanceof AppError) {
      res.status(err.status).json(err.payload);
    } else {
      logger.warn(err.stack);
      const { message } = err;
      res.status(500).json({ message });
    }
  });

  const server = createTerminus(createServer(app), {
    signals: ['SIGINT', 'SIGUSR2'],
    onSignal: teardownServer,
  });

  return Promise.resolve(server);
};

(async () => {
  /* istanbul ignore next */
  if (['development', 'production'].includes(process.env.NODE_ENV)) {
    try {
      const server = await initServer();
      const port = config.get('port');
      server.listen(port, () => logger.info(`Listening on port ${port}`));
    } catch (err) {
      logger.warn(err.stack);
      process.exit(1);
    }
  }
})();

export {
  initServer,
  teardownServer,
};
