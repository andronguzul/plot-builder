
export interface IPlayerThoughts {
  trigger: string;
  text: string;
}

export interface IPlayerThoughtsFile {
  playerThoughts: IPlayerThoughts[];
}

export interface IRadio {
  trigger: string;
  text: string;
  clipName: string;
}

export interface IRadioFile {
  radio: IRadio[];
}

export interface IPlayerThoughtsData {
  trigger: string;
  en: string;
  ru: string;
  ua: string;
}

export interface IRadioData {
  trigger: string;
  clipName: string;
  en: string;
  ru: string;
  ua: string;
}

export interface IBaseTrigger {
  trigger: string;
}
