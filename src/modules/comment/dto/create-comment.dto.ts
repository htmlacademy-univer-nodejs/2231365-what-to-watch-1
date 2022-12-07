import {IsInt, IsMongoId, Length, IsString} from 'class-validator';


export default class CreateCommentDto {
  @Length(5, 1024, {message: 'Text length should be from 5 to 1024.'})
  @IsString({message: 'Text is required.'})
  public text!: string;

  @IsInt({message: 'Rate should be an integer.'})
  public rating!: number;

  public userId!: string;

  @IsMongoId({message: 'MovieId must be valid mongoId.'})
  public movieId!: string;
}
