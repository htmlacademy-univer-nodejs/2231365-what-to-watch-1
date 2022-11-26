import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`${chalk.hex('#65cddb').bold('Программа для подготовки данных для REST API сервера.')}

${chalk.bold('Пример:')} ${chalk.hex('#8adb90')('node')} ${chalk.hex('#f295f5')('cli.js')} ${chalk.hex('#ffb17a')('--<command>')} ${chalk.hex('#eaed91')('[--arguments]')}

${chalk.bold('Команды:')}
     ${chalk.hex('#ffb17a')('--version:')}                    # выводит номер версии
     ${chalk.hex('#ffb17a')('--help:')}                       # печатает этот текст
     ${chalk.hex('#ffb17a')('--import')} ${chalk.hex('#eaed91')('<login> <password> <host> <dbname> <salt> <path>:')}              # импортирует данные из TSV
     ${chalk.hex('#ffb17a')('--generate')} ${chalk.hex('#eaed91')('<n> <path> <url>:')}  # генерирует произвольное количество тестовых данных

Для использования CLI напрямую (без ключевого слова "node"), введите в консоли ${chalk.hex('#ff7ac1').bold('chmod u+x cli.js')} (только для MacOS и Linux).
            `);
  }
}
