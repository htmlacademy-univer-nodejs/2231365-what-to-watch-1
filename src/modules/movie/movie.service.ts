import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {MovieEntity} from './movie.entity.js';
import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {types} from '@typegoose/typegoose';
import {Genre} from '../../types/movie-genre.enum.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DEFAULT_MOVIE_COUNT} from './movie.constant.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
        @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.name}`);

    return result.populate('userId');
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).populate('userId').exec();
  }

  public async deleteById(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  public async find(limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movieLimit = limit ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel.find().sort({createdAt: SortType.Down}).limit(movieLimit).populate('userId').exec();
  }

  public async findByGenre(genre: Genre, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movieLimit = limit ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel.find({genre: genre}).sort({createdAt: SortType.Down}).limit(movieLimit).populate('userId').exec();
  }

  public async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({isPromo: true}).populate('userId').exec();
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, dto, {new: true}).populate('userId');
  }

  public async updateCommentsCount(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndUpdate(movieId, {$inc: {commentsCount: 1}});
  }

  public async updateRating(movieId: string, rate: number): Promise<void | null> {
    const prevValues = await this.movieModel.findById(movieId).select('rating commentsCount');
    const prevRating = prevValues?.['rating'] ?? 0;
    const prevCommentsCount = prevValues?.['commentsCount'] ?? 0;
    return this.movieModel.findByIdAndUpdate(movieId, {rating: (prevRating * prevCommentsCount + rate) / (prevCommentsCount + 1), new: true});
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel.exists({_id: documentId})) !== null;
  }
}
