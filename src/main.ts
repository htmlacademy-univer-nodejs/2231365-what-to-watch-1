import 'reflect-metadata';
import {Container} from 'inversify';
import {LoggerInterface} from './common/logger/logger.interface.js';
import LoggerService from './common/logger/logger.service.js';
import {Component} from './types/component.types.js';
import {types} from '@typegoose/typegoose';
import {ConfigInterface} from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import DatabaseService from './common/database-client/database.service.js';
import {DatabaseInterface} from './common/database-client/database.interface.js';

import UserService from './modules/user/user.service.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';

import MovieService from './modules/movie/movie.service.js';
import {MovieServiceInterface} from './modules/movie/movie-service.interface.js';
import {MovieEntity, MovieModel} from './modules/movie/movie.entity.js';

import CommentService from './modules/comment/comment.service.js';
import {CommentServiceInterface} from './modules/comment/comment-service.interface.js';
import {CommentEntity, CommentModel} from './modules/comment/comment.entity.js';

import {ControllerInterface} from './common/controller/controller.interface.js';
import UserController from './modules/user/user.controller.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface';
import ExceptionFilter from './common/errors/exception-filter.js';
import MovieController from './modules/movie/movie.controller.js';
import CommentController from './modules/comment/comment.controller.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();

applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

applicationContainer.bind<MovieServiceInterface>(Component.MovieServiceInterface).to(MovieService);
applicationContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);

applicationContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.MovieController).to(MovieController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
