import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token)
      throw new UnauthorizedException('Authorization Token not found');

    const decode = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (!decode) throw new UnauthorizedException('Invalid Authorization Token');

    req.user = {
      id: decode.id,
      email: decode.email,
      role: decode.role,
    };

    next();
  }
}
