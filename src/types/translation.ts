
export enum Language {
  EN = 'en',
  UA = 'uk_UA',
  RU = 'ru_RU',
}

export interface ITranslation {
  key: string;
  [Language.EN]?: string;
  [Language.UA]?: string;
  [Language.RU]?: string;
}