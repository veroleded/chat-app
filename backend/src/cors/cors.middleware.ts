import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000'); // Укажите свой домен
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Разрешить передачу учетных данных

    if (req.method === 'OPTIONS') {
      res.sendStatus(200); // Отвечаем статусом 200 на предварительный запрос OPTIONS
    } else {
      next();
    }
  }
}
