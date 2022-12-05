import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/movie-genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose({ name: 'createdAt'})
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre[];

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public preview!: string;

  @Expose()
  public video!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public duration!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}
