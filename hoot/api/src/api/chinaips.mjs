/* eslint-disable no-bitwise */
import fs from 'fs';
import ip from 'ip';
import _ from 'lodash';
import config from 'config';
import { Router } from 'express';

export default async ({ db }) => {
  await db.defaultsDeep({
    chinaips: {},
    mask: 0xff << 24,
  }).write();

  const api = Router();
  api.route('')
    .put(async (req, res, next) => {
      try {
        const raw = await fs.promises.readFile(config.get('china_ip_list'), 'utf8');
        const lst = raw.trim().split('\n');

        const masks = lst.map((cidr) => Number(cidr.split('/')[1]));
        const minMask = _.min(masks);

        const mask = ((1 << minMask) - 1) << (32 - minMask);

        const chinaips = _.chain(lst).map((cidr) => {
          const { firstAddress, lastAddress } = ip.cidrSubnet(cidr);
          return [ip.toLong(firstAddress), ip.toLong(lastAddress)];
        }).groupBy(([start]) => (start & mask)).value();

        await db.set('chinaips', chinaips).set('mask', mask).write();

        res.status(204).send();
      } catch (e) {
        next(e);
      }
    })
    .get((req, res) => {
      const result = db.get('chinaips');
      res.json({ result });
    });

  return Promise.resolve(api);
};
