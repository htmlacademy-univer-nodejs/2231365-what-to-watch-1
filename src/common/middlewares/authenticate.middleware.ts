import {NextFunction, Request, Response} from 'express';
import * as jose from 'jose';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {createSecretKey} from 'crypto';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;
    const {payload} = await jose.jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));
    const {email, id} = payload;

    if (!email || !id) {
      return next(new HttpError(
        StatusCodes.FORBIDDEN,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }

    req.user = { email: `${email}`, id: `${id}` };
    return next();
  }
}
