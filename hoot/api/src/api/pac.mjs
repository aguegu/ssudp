import fs from 'fs';
import { Router } from 'express';
import Handlebars from 'handlebars';
import { body } from 'express-validator';
import { validate } from '../utils.mjs';

export default async ({ db }) => {
  await db.defaultsDeep({
    proxy: 'PROXY 127.0.0.1:4411',
  }).write();

  const api = Router();

  const source = await fs.promises.readFile('templates/whitelist.pac', 'utf8');
  const template = Handlebars.compile(source);

  api.route('')
    .get((req, res) => {
      res.type('application/x-ns-proxy-autoconfig').send(template(db.value()));
    })
    .put([
      body('proxy').exists().trim(),
    ], async (req, res, next) => {
      try {
        const { proxy } = validate(req);
        await db.set({ proxy }).write();
        res.status(204).send();
      } catch (e) {
        next(e);
      }
    });

  return Promise.resolve(api);
};
