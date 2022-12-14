# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

#### Запустить проект в режиме разработчика

```bash
npm run start:dev
```

В процессе запуска проекта будет выполнен запуск результирующего кода. Включен автоматический перезапуск через nodemon.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить фейковый сервер

```bash
npm run mock:server
```

Запускает фейковый сервер для получения с него заранее прописанных в файле `mock-server-data.json` данных.

#### Запустить redoc

```bash
npm run redoc
```

Запускает на http://127.0.0.1:8080 красиво оформленную спецификацию в формате OpenApi.

#### Запустить docker

```bash
npm run docker:up
```

Запускает контейнеры в Docker (MongoDB).

#### Остановить docker

```bash
npm run docker:down
```

Останавливает работы контейнеров в Docker.

#### Запустить CLI

```bash
npm run cli
```

Запускает CLI (по умолчанию вызывается команда `help`).

### Переменные окружения

Файл-пример с переменными окружения находится в корне проекта под названием `.env-example`.

- `DB_NAME=what-to-watch` - название БД
- `DB_HOST=127.0.0.1` - хост, где расположена БД
- `DB_PORT=27017` - порт, на котором расположена БД
- `DB_USER=admin` - имя пользователя БД
- `DB_PASSWORD=test` - пароль пользователя БД
- `SALT=supersecretsalt` - соль для хэширования паролей
- `JWT_SECRET=supersecretjwt` - соль для JWT-токена
- `UPLOAD_DIRECTORY=upload` - директория загрузки 
- `STATIC_DIRECTORY_PATH=static` - директория со статикой
- `PORT=1234` - порт, на котором запущен сервер
- `HOST=localhost` - хост, на котором запущен сервер

### Запросы к серверу

Пробные запросы к серверу прописаны в файле `queries.http`. В IDE можно нажать на значок стрелочки, чтобы отправить запрос.
