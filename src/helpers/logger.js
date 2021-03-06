import { createLogger, format, transports } from 'winston';
const { combine, printf } = format;

const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: combine(format.colorize(), logFormat)
    })
  ],
  exitOnError: false
});

export default logger;