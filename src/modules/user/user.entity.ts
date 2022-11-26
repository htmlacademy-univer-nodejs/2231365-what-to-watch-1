import {User} from '../../types/user.type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {checkPassword, createSHA256} from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.username = data.username;
    this.email = data.email;
    this.avatar = data.avatar;
  }

  @prop({ required: true, minlength: [1, 'Min length for username is 1'], maxlength: [15, 'Max length for username is 15'] })
  public username!: string;

  @prop({ unique: true, required: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'] })
  public email!: string;

  @prop({ required: false, match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png'] })
  public avatar!: string;

  @prop({ required: true, default: [], type: () => String })
  public inList!: string[];

  @prop({ required: true })
  private password!: string;

  public setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
