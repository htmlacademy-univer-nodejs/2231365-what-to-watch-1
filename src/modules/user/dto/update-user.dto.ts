import {Length, IsString, IsOptional} from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @Length(1, 15, {message: 'Username length should be from 1 to 15.'})
  @IsString({message: 'Username is required.'})
  public username?: string;

  @IsOptional()
  @IsString({message: 'Avatar path is required.'})
  public avatar?: string;
}
