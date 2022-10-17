import {MovieGeneratorInterface} from './movie-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  generateRandomDate,
  generateRandomPassword,
  generateRandomColor
} from '../../utils/random.js';
import {Genre} from '../../types/movie-genre.enum.js';
import {transletirate} from '../../utils/transliteration.js';

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const traslitName = transletirate(name);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = generateRandomDate().toISOString();
    const genre = getRandomItems<string>(Object.values(Genre)).join(';');
    const releaseYear = generateRandomValue(1980, 2022);
    const rating = generateRandomValue(0, 10, 1);
    const preview = `${traslitName}-preview.mp4`;
    const video = `${traslitName}.mp4`;
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const producer = getRandomItems<string>(this.mockData.producers).join(';');
    const duration = generateRandomValue(30, 200);
    const commentsCount = generateRandomValue(0, 100);
    const username = getRandomItem<string>(this.mockData.users.usernames);
    const email = getRandomItem<string>(this.mockData.users.emails);
    const password = generateRandomPassword();
    const avatar = `${username}.png`;
    const poster = `${traslitName}-poster.png`;
    const backgroundImage = `${traslitName}-background.png`;
    const backgroundColor = generateRandomColor();

    return [
      name,
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
      backgroundColor
    ].join('\t');
  }
}
