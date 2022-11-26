import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {MovieEntity} from '../movie/movie.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: [5, 'Min length for text is 5'], maxlength: [1024, 'Max length for name is 1024'] })
  public text!: string;

  @prop({ required: true, min: [1, 'Min rate for movie is 1'], max: [10, 'Max rate for movie is 10']})
  public rating!: number;

  @prop({ required: true, default: new Date() })
  public publicationDate!: Date;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: MovieEntity })
  public movieId!: Ref<MovieEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
