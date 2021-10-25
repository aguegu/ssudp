import config from 'config';
import winston from 'winston';

const { loggers, format, transports } = winston;

loggers.add('main', {
  level: config.get('logLevel'),
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
  ],
});
