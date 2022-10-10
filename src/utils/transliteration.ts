const alphabet: { [key: string]: string } = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'yo',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'h',
  'ц': 'ts',
  'ч': 'ch',
  'ш': 'sh',
  'щ': 'sch',
  'ъ': '\'',
  'ы': 'i',
  'ь': '\'',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya',
  ' ': '-'
};

export function transletirate(word: string): string {
  let answer = '';
  word = word.toLowerCase();
  for (const letter of word) {
    if (!alphabet[letter]) {
      answer += letter;
    } else {
      answer += alphabet[letter];
    }
  }
  return answer;
}
