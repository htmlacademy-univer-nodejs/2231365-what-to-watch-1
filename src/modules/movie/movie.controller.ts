import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {fillDTO, IsValidGenre} from '../../utils/common.js';
import MovieResponse from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import * as core from 'express-serve-static-core';
import {RequestQuery} from '../../types/request-query.type.js';
import {Genre} from '../../types/movie-genre.enum.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {Prop} from '../../types/prop.enum.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import ShortMovieResponse from './response/short-movie.response.js';

type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.index});

    this.addRoute({
      path: '/create',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateMovieDto)
      ]
    });

    this.addRoute({path: '/promo', method: HttpMethod.GET, handler: this.showPromo});

    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.GET,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId', Prop.Params),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Params)
      ]
    });

    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.PATCH,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(UpdateMovieDto), new ValidateObjectIdMiddleware('movieId', Prop.Params),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Params)
      ]
    });

    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId', Prop.Params),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Params)
      ]
    });

    this.addRoute({
      path: '/:movieId/comments',
      method: HttpMethod.GET,
      handler: this.showComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId', Prop.Params),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId', Prop.Params)
      ]
    });
  }

  public async index({query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    let movies;
    const {limit, genre} = query;
    if (genre && IsValidGenre(genre)) {
      movies = await this.movieService.findByGenre(genre as Genre, limit);
    } else {
      movies = await this.movieService.find(limit);
    }
    this.ok(res, fillDTO(ShortMovieResponse, movies));
  }

  public async create(req: Request<object, object, CreateMovieDto>, res: Response): Promise<void> {
    const {body, user} = req;
    const movie = await this.movieService.create({...body, userId: user.id});
    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async show({params}: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const {movieId} = params;
    const movie = await this.movieService.findById(movieId);

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async update(req: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const {body, params, user} = req;
    const {movieId} = params;
    await this.checkAuthor(user.id, movieId);
    const updatedMovie = await this.movieService.updateById(movieId, body);
    await this.ok(res, fillDTO(MovieResponse, updatedMovie));
  }

  public async delete(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const {params, user} = req;
    const {movieId} = params;
    await this.checkAuthor(user.id, movieId);
    await this.movieService.deleteById(movieId);
    await this.commentService.deleteAllByMovieId(movieId);
    this.noContent(res, `Movie ${movieId} was successfully deleted.`);
  }

  public async showPromo(_req: Request, res: Response): Promise<void> {
    const movie = await this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async showComments({params}: Request<core.ParamsDictionary | ParamsGetMovie, object, object>, res: Response): Promise<void> {
    const {movieId} = params;
    const comments = await this.commentService.findByMovieId(movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  private async checkAuthor(userId: string, movieId: string) {
    const movie = await this.movieService.findById(movieId);
    if (movie?.userId?.id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can not update or delete this movie because you did not publish it.',
        'MovieController'
      );
    }
  }
}
