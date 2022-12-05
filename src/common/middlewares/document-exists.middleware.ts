import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {Prop} from '../../types/prop.enum.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
    private readonly propType: Prop
  ) {}

  public async execute({body, params}: Request, _res: Response, next: NextFunction): Promise<void> {
    let documentId;
    if (this.propType === Prop.Body) {
      documentId = body[this.paramName];
    } else {
      documentId = params[this.paramName];
    }
    const entity = await this.service.exists(documentId);
    if (!entity) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
