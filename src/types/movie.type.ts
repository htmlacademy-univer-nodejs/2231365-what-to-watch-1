import {User} from './user.type';
import {Genre} from './movie-genre.enum';

export type Movie = {
  name: string;
  description: string;
  publicationDate: Date;
  genre: Genre[];
  releaseYear: number;
  rating: number;
  preview: string;
  video: string;
  actors: string[];
  producer: string[];
  duration: number;
  commentsCount: number;
  user: User;
  poster: string;
  backgroundImage: string;
  backgroundColor: string;
}
