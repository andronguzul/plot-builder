
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
  text: string;
}

export interface IRadioData {
  trigger: string;
  clipName: string;
  text: string;
}

export interface IBaseTrigger {
  trigger: string;
}
