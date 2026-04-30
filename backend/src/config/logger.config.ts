import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${context || 'Application'}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
  }),
);

export const createLogger = () => {
  const transports: winston.transport[] = [];

  // Console uniquement en développement ou si pas serverless
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
        level: process.env.LOG_LEVEL || 'info',
      }),
    );
  }

  // File transports seulement si pas serverless
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    // Error logs
    transports.push(
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: logFormat,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      }),
    );

    // Combined logs
    transports.push(
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        format: logFormat,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
      }),
    );
  }

  // Si aucun transport (serverless production), utiliser console simple
  if (transports.length === 0) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.simple(),
        level: 'error', // Seulement les erreurs
      }),
    );
  }

  return WinstonModule.createLogger({
    transports,
    exceptionHandlers: process.env.VERCEL ? [] : [
      new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: process.env.VERCEL ? [] : [
      new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
  });
};
