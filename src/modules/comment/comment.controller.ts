import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import {fillDTO} from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {Prop} from '../../types/prop.enum.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {MovieServiceInterface} from '../movie/movie-service.interface';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new ValidateObjectIdMiddleware('movieId', Prop.Body),
        new DocumentExistsMiddleware(this.movieService, 'Movide', 'movieId', Prop.Body)
      ]
    });
  }

  public async create(req: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    const {body} = req;
    const comment = await this.commentService.create({...body, userId: req.user.id});
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
