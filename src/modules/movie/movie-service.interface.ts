import CreateMovieDto from './dto/create-movie.dto.js';
import {MovieEntity} from './movie.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface MovieServiceInterface {
    create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
    findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
}
