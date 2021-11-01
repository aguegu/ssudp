import os from 'os';
import winston from 'winston';
import { Router } from 'express';
import pkg from '../../package.json';

import apiPac from './pac.mjs';
import apiGfwlist from './gfwlist.mjs';
import apiChinaips from './chinaips.mjs';

export default async ({ db }) => {
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

  api.use('/pac', await apiPac({ db }));
  api.use('/gfwlist', await apiGfwlist());
  api.use('/chinaips', await apiChinaips({ db }));

  return Promise.resolve(api);
};
