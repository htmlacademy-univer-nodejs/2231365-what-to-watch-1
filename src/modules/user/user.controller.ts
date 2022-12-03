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

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({path: '/register', method: HttpMethod.POST, handler: this.register});

    this.addRoute({path: '/login', method: HttpMethod.POST, handler: this.login});
    this.addRoute({path: '/login', method: HttpMethod.GET, handler: this.getState});

    this.addRoute({path: '/logout', method: HttpMethod.DELETE, handler: this.logout});

    this.addRoute({path: '/inList', method: HttpMethod.GET, handler: this.getInList});
    this.addRoute({path: '/inList', method: HttpMethod.POST, handler: this.addInList});
    this.addRoute({path: '/inList', method: HttpMethod.DELETE, handler: this.deleteInList});
  }

  public async register({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
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

  public async getInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findInList(body.userId);
    this.ok(_res, fillDTO(MovieResponse, result));
  }

  public async addInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.addInList(body.movieId, body.userId);
    this.noContent(res, {message: 'Фильм успешно добавлен в список "Мой лист".'});
  }

  public async deleteInList({body}: Request<Record<string, unknown>, Record<string, unknown>, {movieId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.deleteInList(body.movieId, body.userId);
    this.noContent(res, {message: 'Фильм успешно удален из списка "Мой лист".'});
  }
}
