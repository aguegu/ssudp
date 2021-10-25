import os from 'os';
import path from 'path';
import config from 'config';
import winston from 'winston';
import { Router } from 'express';
import pkg from '../../package.json';

export default async () => {
  const api = Router();
  const startAt = Date.now();

  const hostname = os.hostname();

  winston.loggers.get('main').info({ hostname, startAt });

  api.get('/about', (req, res) => {
    const { version, build, isReleased } = pkg;

    res.json({
      result: {
        hostname,
        version,
        build,
        startAt,
        isReleased,
        name: 'hoot',
      },
    });
  });

  api.get('/pac/whitelist.pac', (req, res) => {
    res.sendFile(path.resolve(path.join(config.get('pac'), 'whitelist.pac')));
  });

  return Promise.resolve(api);
};
