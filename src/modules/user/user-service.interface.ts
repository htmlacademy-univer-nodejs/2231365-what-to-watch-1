import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {MovieEntity} from '../movie/movie.entity.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface UserServiceInterface extends DocumentExistsInterface {
    create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>
    findInList(userId: string): Promise<DocumentType<MovieEntity>[]>;
    addInList(movieId: string, userId: string): Promise<void | null>;
    deleteInList(movieId: string, userId: string): Promise<void | null>;
    verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
