import {Genre} from '../../../types/movie-genre.enum.js';
import {IsArray, IsEnum, IsInt, Length, IsString, IsOptional} from 'class-validator';

export default class UpdateMovieDto {
  @IsOptional()
  @Length(2, 100, {message: 'Length for name should be from 2 to 100.'})
  @IsString({message: 'Name is required.'})
  public name?: string;

  @IsOptional()
  @Length(20, 1024, {message: 'Length for description should be from 20 to 1024.'})
  @IsString({message: 'Description is required.'})
  public description?: string;

  @IsOptional()
  @IsArray({message: 'Field genre must be an array.'})
  @IsEnum({each: true, message: 'Genre must be an array of enums.'})
  public genre?: Genre[];

  @IsOptional()
  @IsInt({message: 'Year must be an integer.'})
  public releaseYear?: number;

  @IsOptional()
  @IsString({message: 'Preview path is required.'})
  public preview?: string;

  @IsOptional()
  @IsString({message: 'Video path is required.'})
  public video?: string;

  @IsOptional()
  @IsArray({message: 'Actors must be an array.'})
  @IsString({each: true, message: 'Actors are required.'})
  public actors?: string[];

  @IsOptional()
  @Length(2, 50, {message: 'Length for producer should be from 2 to 50.'})
  @IsString({message: 'Producer is required.'})
  public producer?: string;

  @IsOptional()
  @IsInt({message: 'Duration must be an integer.'})
  public duration?: number;

  @IsOptional()
  @IsString({message: 'Poster path is required.'})
  public poster?: string;

  @IsOptional()
  @IsString({message: 'Background image path is required.'})
  public backgroundImage?: string;

  @IsOptional()
  @IsString({message: 'Background color is required.'})
  public backgroundColor?: string;
}
