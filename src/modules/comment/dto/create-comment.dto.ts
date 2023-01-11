import {IsInt, IsMongoId, Length, IsString, IsNotEmpty, Min, Max} from 'class-validator';


export default class CreateCommentDto {
  @Length(5, 1024, {message: 'Text length should be from 5 to 1024.'})
  @IsString({message: 'Text is required.'})
  public text!: string;

  @IsInt({message: 'Rate should be an integer.'})
  @IsNotEmpty({message: 'rate is required.'})
  @Min(1, {message: 'Min value for rating is 1.'})
  @Max(10, {message: 'Max value for rating is 10.'})
  public rating!: number;

  public userId!: string;

  @IsMongoId({message: 'MovieId must be valid mongoId.'})
  public movieId!: string;
}
