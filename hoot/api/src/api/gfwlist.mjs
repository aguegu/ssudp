import fs from 'fs';
import config from 'config';
import { Router } from 'express';

export default async () => {
  const api = Router();

  api.route('')
    .get(async (req, res, next) => {
      try {
        const raw = await fs.promises.readFile(config.get('gfwlist'), 'utf8');
        const result = Buffer.from(raw, 'base64').toString();
        res.json({ result });
      } catch (e) {
        next(e);
      }
    });

  return Promise.resolve(api);
};
