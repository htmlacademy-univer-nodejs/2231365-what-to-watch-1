import {Expose} from 'class-transformer';
import {Genre} from '../../../types/movie-genre.enum.js';

export default class MovieResponse {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
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

  @Expose()
  public userId!: string;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}
