import {Genre} from '../types/movie-genre.enum.js';
import {Movie} from '../types/movie.type.js';
import crypto from 'crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import * as jose from 'jose';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../types/validation-error-fiels.type.js';
import {ServiceError} from '../types/service-error.enum.js';
import {UnknownObject} from '../types/unknown-object.type.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';

export const createMovie = (row: string): Movie => {
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
    poster,
    backgroundImage,
    backgroundColor
  ] = tokens;

  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(';').map((g) => {
      if (IsValidGenre(g)) {
        return g as Genre;
      } else {
        throw new Error('Такого жанра не существует.');
      }
    }),
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    preview: preview,
    video: video,
    actors: actors.split(';'),
    producer: producer,
    duration: parseInt(duration, 10),
    commentsCount: parseInt(commentsCount, 10),
    user: {username, email, avatar},
    poster: poster,
    backgroundImage: backgroundImage,
    backgroundColor: backgroundColor,
  };
};

export const getErrorMessage = (error: Error | string): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const checkPassword = (password: string): void =>
{
  if (password.length < 6 || password.length > 12) {
    throw new Error('Password must be from 6 to 12 characters.');
  }
};

export function IsValidGenre(genre: string): boolean {
  const options: string[] = Object.values(Genre);
  return options.includes(genre);
}

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
