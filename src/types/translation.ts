
export enum Language {
  EN = 'en',
  UA = 'ua',
  RU = 'ru',
}

export interface ILanguage {
  [Language.EN]: string;
  [Language.UA]: string;
  [Language.RU]: string;
}

export interface ITranslation {
  key: string;
  [Language.EN]?: string;
  [Language.UA]?: string;
  [Language.RU]?: string;
}

export interface ILocalization {
  translations: ITranslation[];
}