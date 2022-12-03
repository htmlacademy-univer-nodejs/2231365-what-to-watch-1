import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum';
import {Request, Response} from 'express';
import {fillDTO} from '../../utils/common.js';
import MovieResponse from './response/movie.response';
import CreateMovieDto from './dto/create-movie.dto';
import {StatusCodes} from 'http-status-codes';
import UpdateMovieDto from './dto/update-movie.dto';
import HttpError from '../../common/errors/http-error.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.index});
    this.addRoute({path: '/create', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.GET, handler: this.get});
    this.addRoute({path: '/:movieId', method: HttpMethod.PATCH, handler: this.update});
    this.addRoute({path: '/:movieId', method: HttpMethod.DELETE, handler: this.delete});
    this.addRoute({path: '/promo', method: HttpMethod.GET, handler: this.getPromo});
  }

  public async index({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const movies = await this.movieService.find(limit);
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(MovieResponse, movie));
  }

  public async get({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${params.movieId} not found.`,
        'MovieController',
      );
    }

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async update({params, body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${params.movieId} not found.`,
        'MovieController',
      );
    }

    const updatedMovie = await this.movieService.updateById(`${params.movieId}`, body);
    await this.ok(res, fillDTO(MovieResponse, updatedMovie));
  }

  public async delete({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(`${params.movieId}`);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${params.movieId} not found.`,
        'MovieController',
      );
    }

    await this.movieService.deleteById(`${params.movieId}`);
    this.noContent(res, `Movie ${params.movieId} was successfully deleted.`);
  }

  public async getPromo(_req: Request, res: Response): Promise<void> {
    const movie = await this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, movie));
  }
}
