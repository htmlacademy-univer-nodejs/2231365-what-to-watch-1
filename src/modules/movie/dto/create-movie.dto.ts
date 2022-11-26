import {Genre} from '../../../types/movie-genre.enum.js';

export default class CreateMovieDto {
  public name!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre[];
  public releaseYear!: number;
  public preview!: string;
  public video!: string;
  public actors!: string[];
  public producer!: string;
  public duration!: number;
  public userId!: string;
  public poster!: string;
  public isPromo!: boolean;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
