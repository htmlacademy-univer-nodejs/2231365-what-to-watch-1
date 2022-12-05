import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {UserServiceInterface} from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import {Request, Response} from 'express';
import {ConfigInterface} from '../../common/config/config.interface.js';
import UserResponse from './response/user.response.js';
import {fillDTO} from '../../utils/common.js';
import LoginUserDto from './dto/login-user.dto.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import MovieResponse from '../movie/response/movie.response.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {MovieServiceInterface} from '../movie/movie-service.interface.js';
import {Prop} from '../../types/prop.enum.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import * as core from 'express-serve-static-core';

type ParamsUpdateUser = {
  userId: string;
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.POST,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]
    });

    this.addRoute({path: '/login', method: HttpMethod.GET, handler: this.getState});

    this.addRoute({path: '/logout', method: HttpMethod.DELETE, handler: this.logout});

    this.addRoute({
      path: '/inList',
      method: HttpMethod.GET,
      handler: this.showInList,
      middlewares: [
        new ValidateObjectIdMiddleware('userId', Prop.Body),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId', Prop.Body)
      ]
    });

    this.addRoute({
      path: '/inList',
      method: HttpMethod.POST,
      handler: this.addInList,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId', Prop.Params), new ValidateObjectIdMiddleware('userId', Prop.Body),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Body),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId', Prop.Body)
      ]
    });

    this.addRoute({
      path: '/inList',
      method: HttpMethod.DELETE,
      handler: this.deleteInList,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId', Prop.Params), new ValidateObjectIdMiddleware('userId', Prop.Body),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Body),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId', Prop.Body)
      ]
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.POST,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId', Prop.Params),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    const newUser = await this.userService.findByEmail(result.email);
    this.created(res, fillDTO(UserResponse, newUser));
  }

  public async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async getState(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async showInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findInList(body.userId);
    this.ok(_res, fillDTO(MovieResponse, result));
  }

  public async addInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.addInList(body.movieId, body.userId);
    this.noContent(res, {message: 'Movie was successfully added to In List'});
  }

  public async deleteInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.deleteInList(body.movieId, body.userId);
    this.noContent(res, {message: 'Movie was successfully removed from In List'});
  }

  public async uploadAvatar(req: Request<core.ParamsDictionary | ParamsUpdateUser>, res: Response) {
    const user = await this.userService.updateById(req.params.userId, {avatar: req.file?.path});
    this.created(res, user);
  }
}
