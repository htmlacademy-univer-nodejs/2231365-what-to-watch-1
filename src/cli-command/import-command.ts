import { CliCommandInterface} from './cli-command.interface.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {createMovie, getErrorMessage} from '../utils/common.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import {UserServiceInterface} from '../modules/user/user-service.interface.js';
import {MovieServiceInterface} from '../modules/movie/movie-service.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import MovieService from '../modules/movie/movie.service.js';
import {MovieModel} from '../modules/movie/movie.entity.js';
import UserService from '../modules/user/user.service.js';
import {UserModel} from '../modules/user/user.entity.js';
import DatabaseService from '../common/database-client/database.service.js';
import {Movie} from '../types/movie.type.js';
import {getURI} from '../utils/db.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private readonly logger: LoggerInterface;
  protected readonly configService: ConfigInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel, MovieModel);
    this.databaseService = new DatabaseService(this.logger);
    this.configService = new ConfigService(this.logger);
  }

  private async saveMovie(movie: Movie) {
    const user = await this.userService.findOrCreate({
      ...movie.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.movieService.create({
      ...movie,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: VoidFunction) {
    const movie = createMovie(line);
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} строк успешно имортированы.`);
    this.databaseService.disconnect();
  }

  public async execute(...parameters:string[]): Promise<void> {
    const login = this.configService.get('DB_USER');
    const password = this.configService.get('DB_PASSWORD');
    const host = this.configService.get('HOST');
    const dbname = this.configService.get('DB_NAME');
    const salt = this.configService.get('SALT');
    const [filename] = parameters;
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('rowCompleted', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      const error = typeof err === 'string' ? err : '';
      this.logger.error(`Не удалось импортировать данные из файла по причине: "${getErrorMessage(error)}"`);
    }
  }
}
