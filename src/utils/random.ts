export const generateRandomValue = (min:number, max: number, numAfterDigit = 0) =>
  Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));

export const getRandomItems = <T>(items: T[]):T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]):T =>
  items[generateRandomValue(0, items.length -1)];

export const generateRandomDate = (start: Date = new Date(2020, 0, 1), end: Date = new Date()) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateRandomPassword = () => Math.random().toString(36).slice(-8);

export const generateRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
