import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {MovieEntity} from './movie.entity.js';
import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {types} from '@typegoose/typegoose';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
        @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.name}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).exec();
  }
}
