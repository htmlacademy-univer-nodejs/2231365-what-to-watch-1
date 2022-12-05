import {IsDateString, IsInt, IsMongoId, Length, IsString} from 'class-validator';


export default class CreateCommentDto {
  @Length(5, 1024, {message: 'Text length should be from 5 to 1024.'})
  @IsString({message: 'Text is required.'})
  public text!: string;

  @IsInt({message: 'Rate should be an integer.'})
  public rating!: number;

  @IsDateString({}, {message: 'Field publicationDate must be correct ISO date.'})
  public publicationDate!: Date;

  @IsMongoId({message: 'UserId must be valid mongoId.'})
  public userId!: string;

  @IsMongoId({message: 'MovieId must be valid mongoId.'})
  public movieId!: string;
}
