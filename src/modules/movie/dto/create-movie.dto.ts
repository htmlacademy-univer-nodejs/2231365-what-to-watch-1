import {Genre} from '../../../types/movie-genre.enum.js';
import {IsArray, IsInt, Length, IsString, ArrayNotEmpty, IsEnum, IsNotEmpty} from 'class-validator';

export default class CreateMovieDto {
  @Length(2, 100, {message: 'Length for name should be from 2 to 100.'})
  @IsString({message: 'Name is required.'})
  public name!: string;

  @Length(20, 1024, {message: 'Length for description should be from 20 to 1024.'})
  @IsString({message: 'Description is required.'})
  public description!: string;

  @IsArray({message: 'Field genre must be an array.'})
  @ArrayNotEmpty({message: 'There should be at least 1 genre.'})
  @IsEnum(Genre, { each: true, message: 'There is one or more invalid genres in array.' })
  public genre!: Genre[];

  @IsInt({message: 'Year must be an integer.'})
  @IsNotEmpty({message: 'Year is required.'})
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

  public userId!: string;

  @IsString({message: 'Poster path is required.'})
  public poster!: string;

  public isPromo?: boolean;

  @IsString({message: 'Background image path is required.'})
  public backgroundImage!: string;

  @IsString({message: 'Background color is required.'})
  public backgroundColor!: string;
}
