import config from 'config';
import express from 'express';
import winston from 'winston';
import { createServer } from 'http';
import expressWinston from 'express-winston';
import { createTerminus } from '@godaddy/terminus';

import './logger.mjs';
import api from './api/index.mjs';

const logger = winston.loggers.get('main');

const teardownServer = async () => {
  logger.info('server teardown');
  logger.end();
};

const initServer = async () => {
  const app = express();

  app.use(expressWinston.logger({ winstonInstance: logger }));
  app.use(express.json());

  app.use('/api', await api());

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
