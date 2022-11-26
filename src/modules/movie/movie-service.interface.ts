import CreateMovieDto from './dto/create-movie.dto.js';
import {MovieEntity} from './movie.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import {Genre} from '../../types/movie-genre.enum.js';
import UpdateMovieDto from './dto/update-movie.dto.js';

export interface MovieServiceInterface {
    create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
    findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
    find(limit?: number): Promise<DocumentType<MovieEntity>[]>;
    updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
    deleteById(movieId: string): Promise<void | null>;
    findByGenre(genre: Genre, limit?: number): Promise<DocumentType<MovieEntity>[]>;
    findPromo(): Promise<DocumentType<MovieEntity> | null>;
    updateCommentsCount(movieId: string): Promise<void | null>;
    updateRating(movieId: string, rate: number): Promise<void | null>;
}
