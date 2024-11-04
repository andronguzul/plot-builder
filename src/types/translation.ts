
export enum Language {
  EN = 'en',
  UA = 'ua',
}

export interface ILanguage {
  [Language.EN]: string;
  [Language.UA]: string;
}

export interface ITranslation {
  key: string;
  [Language.EN]?: string;
  [Language.UA]?: string;
}

export interface ILocalization {
  translations: ITranslation[];
}