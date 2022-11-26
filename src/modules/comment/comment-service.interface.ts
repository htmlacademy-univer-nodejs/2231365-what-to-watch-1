import CreateCommentDto from './dto/create-comment.dto.js';
import {CommentEntity} from './comment.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CommentServiceInterface {
    create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
    findByMovieId(movieId: string, limit?: number): Promise<DocumentType<CommentEntity>[] | null>;
    deleteAllByMovieId(movieId: string): Promise<number | null>;
}
