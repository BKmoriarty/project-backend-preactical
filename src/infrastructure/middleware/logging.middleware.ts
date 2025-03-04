import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);
  private readonly logFilePath = path.join(__dirname, '../../../logs/api.log');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = process.hrtime();

    // เมื่อ response เสร็จสิ้น
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const responseTime = seconds * 1000 + nanoseconds / 1e6; // แปลงเป็น milliseconds

      const logMessage = `${new Date().toISOString()} | ${method} ${originalUrl} | ${responseTime.toFixed(2)}ms\n`;

      // บันทึกลงไฟล์
      fs.appendFile(this.logFilePath, logMessage, (err) => {
        if (err) {
          this.logger.error(`Failed to write log: ${err.message}`);
        }
      });

      // แสดงใน console (optional)
      this.logger.log(
        `${method} ${originalUrl} - ${responseTime.toFixed(2)}ms`,
      );
    });

    next();
  }
}
