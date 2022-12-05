import {Genre} from '../../../types/movie-genre.enum.js';
import {IsArray, IsDateString, IsInt, IsMongoId, Length, IsString} from 'class-validator';

export default class CreateMovieDto {
  @Length(2, 100, {message: 'Length for name should be from 2 to 100.'})
  @IsString({message: 'Name is required.'})
  public name!: string;

  @Length(20, 1024, {message: 'Length for description should be from 20 to 1024.'})
  @IsString({message: 'Description is required.'})
  public description!: string;

  @IsDateString({}, {message: 'Field publicationDate must be correct ISO date.'})
  public publicationDate!: Date;

  @IsArray({message: 'Field genre must be an array.'})
  // @IsEnum({each: true, message: 'Genre must be an array of enums.'})
  public genre!: Genre[];

  @IsInt({message: 'Year must be an integer.'})
  public releaseYear!: number;

  @IsString({message: 'Preview path is required.'})
  public preview!: string;

  @IsString({message: 'Video path is required.'})
  public video!: string;

  @IsArray({message: 'Actors must be an array.'})
  @IsString({each: true, message: 'Actors are required.'})
  public actors!: string[];

  @Length(2, 50, {message: 'Length for producer should be from 2 to 50.'})
  @IsString({message: 'Producer is required.'})
  public producer!: string;

  @IsInt({message: 'Duration must be an integer.'})
  public duration!: number;

  @IsMongoId({message: 'UserId must be valid mongoId.'})
  public userId!: string;

  @IsString({message: 'Poster path is required.'})
  public poster!: string;

  public isPromo?: boolean;

  @IsString({message: 'Background image path is required.'})
  public backgroundImage!: string;

  @IsString({message: 'Background color is required.'})
  public backgroundColor!: string;
}
