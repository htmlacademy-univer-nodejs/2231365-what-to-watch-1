import {config} from 'dotenv';
import {inject, injectable} from 'inversify';
import {ConfigInterface} from './config.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {configSchema, ConfigSchema} from './config.schema.js';
import {Component} from '../../types/component.types.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private readonly config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Не удалось прочесть .env файл. Возможно, файл не существует.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}
