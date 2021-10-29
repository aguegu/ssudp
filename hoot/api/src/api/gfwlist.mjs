import fs from 'fs';
import config from 'config';
import { Router } from 'express';

export default async () => {
  const api = Router();

  const loadSource = async () => {
    const raw = await fs.promises.readFile(config.get('gfwlist'), 'utf8');
    return Promise.resolve(Buffer.from(raw, 'base64').toString());
  };

  let src = await loadSource();

  api.route('')
    .put((req, res) => {
      loadSource().then((lst) => {
        src = lst;
      });
      res.status(204).send();
    })
    .get((req, res) => {
      res.send(src);
    });

  return Promise.resolve(api);
};
