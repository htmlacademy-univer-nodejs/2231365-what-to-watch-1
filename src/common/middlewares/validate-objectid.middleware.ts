import mongoose from 'mongoose';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';
import {Prop} from '../../types/prop.enum.js';

const {Types} = mongoose;

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(
    private param: string,
    private propType: Prop
  ) {}

  public execute({body, params}: Request, _res: Response, next: NextFunction): void {
    let objectId;
    if (this.propType === Prop.Body) {
      objectId = body[this.param];
    } else {
      objectId = params[this.param];
    }

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
