import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/movie-genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class ShortMovieResponse {
  @Expose()
  public name!: string;

  @Expose({ name: 'createdAt'})
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre[];

  @Expose()
  public commentsCount!: number;

  @Expose()
  public preview!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;
}
