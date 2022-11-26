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

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).exec();
  }

  public async deleteById(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  public async find(limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movieLimit = limit ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: 'movieId',
          foreignField: 'movieId',
          pipeline: [
            {$project: {_id: 1, rating: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'},
        }
      },
      {$unset: 'comments'},
      {$limit: movieLimit},
      {$sort: {publicationDate: SortType.Down}}
    ]);
  }

  public async findByGenre(genre: Genre, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movieLimit = limit ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel.find({genre: genre}).sort({publicationDate: SortType.Down}).limit(movieLimit).populate('userId').exec();
  }

  public async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({isPromo: true}).populate('userId');
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, dto, {new: true}).populate('userId');
  }

  public async updateCommentsCount(movieId: string): Promise<void | null> {
    return this.movieModel.findByIdAndUpdate(movieId, {$inc: {commentsCount: 1}, new: true});
  }

  public async updateRating(movieId: string, rate: number): Promise<void | null> {
    const prevValues = await this.movieModel.findById(movieId).select('rating commentsCount');
    const prevRating = prevValues?.['rating'] ?? 0;
    const prevCommentsCount = prevValues?.['commentsCount'] ?? 0;
    return this.movieModel.findByIdAndUpdate(movieId, {rating: (prevRating * prevCommentsCount + rate) / (prevCommentsCount + 1), new: true});
  }
}
