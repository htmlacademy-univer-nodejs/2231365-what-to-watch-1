import {UserEntity} from './user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {MovieEntity} from '../movie/movie.entity.js';
import UpdateUserDto from './dto/update-user.dto.js';


@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
      @inject(Component.LoggerInterface) private logger: LoggerInterface,
      @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
      @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  async findInList(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const movieList = await this.userModel.findById(userId).select('inList');
    if (!movieList) {
      return [];
    }
    return this.movieModel.find({_id: { $in: movieList.inList }});
  }

  async addInList(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, { $push: {inList: movieId}, new: true });
  }

  async deleteInList(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: {inList: movieId}, new: true });
  }

  async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, {new: true}).exec();
  }

  async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({_id: documentId})) !== null;
  }
}
