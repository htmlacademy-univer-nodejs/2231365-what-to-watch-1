import {Movie} from '../types/movie.type.js';
import {Genre} from '../types/movie-genre.enum.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [name,
    description,
    publicationDate,
    genre,
    releaseYear,
    rating,
    preview,
    video,
    actors,
    producer,
    duration,
    commentsCount,
    username,
    email,
    avatar,
    password,
    poster,
    backgroundImage,
    backgroundColor] = tokens;

  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(';').map((g) => <Genre>g),
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    preview: preview,
    video: video,
    actors: actors.split(';'),
    producer: producer.split(';'),
    duration: parseInt(duration, 10),
    commentsCount: parseInt(commentsCount, 10),
    user: {username, email, avatar, password},
    poster: poster,
    backgroundImage: backgroundImage,
    backgroundColor: backgroundColor,
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
