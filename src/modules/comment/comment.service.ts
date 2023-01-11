import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {MovieServiceInterface} from '../movie/movie-service.interface.js';
import {DEFAULT_COMMENT_COUNT} from './comment.constant.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
        @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
        @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created by: ${dto.userId}`);
    await this.movieService.updateRating(dto.movieId, dto.rating);
    await this.movieService.updateCommentsCount(dto.movieId);

    return comment.populate('userId');
  }

  public async findByMovieId(movieId: string, limit?: number): Promise<DocumentType<CommentEntity>[] | null> {
    const commentLimit = limit ?? DEFAULT_COMMENT_COUNT;

    return this.commentModel.find({movieId: movieId}).sort({createdAt: SortType.Down}).limit(commentLimit).populate('userId');
  }

  public async deleteAllByMovieId(movieId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({movieId}).exec();
    return result.deletedCount;
  }
}
