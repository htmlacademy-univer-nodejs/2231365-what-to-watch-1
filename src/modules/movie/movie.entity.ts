import {Genre} from '../../types/movie-genre.enum.js';
import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: [2, 'Min length for name is 2'], maxlength: [100, 'Max length for name is 100'] })
  public name!: string;

  @prop({ required: true, minlength: [20, 'Min length for description is 20'], maxlength: [1024, 'Max length for description is 1024'] })
  public description!: string;

  @prop({ required: true, default: new Date() })
  public publicationDate!: Date;

  @prop({type: () => String, enum: Genre })
  public genre!: Genre[];

  @prop({ required: true })
  public releaseYear!: number;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true })
  public preview!: string;

  @prop({ required: true })
  public video!: string;

  @prop({ required: true })
  public actors!: string[];

  @prop({ required: true, minlength: [2, 'Min length for producer is 2'], maxlength: [50, 'Max length for producer is 50'] })
  public producer!: string[];

  @prop({ required: true })
  public duration!: number;

  @prop({ required: true, default: 0 })
  public commentsCount!: number;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, match: [/.*\.jpg/, 'Poster must be jpg'] })
  public poster!: string;

  @prop({ required: true, match: [/.*\.jpg/, 'Background image must be jpg'] })
  public backgroundImage!: string;

  @prop({ required: true })
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
