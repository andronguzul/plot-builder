export interface IAudio {
  trigger: string;
  text: string;
  clipName: string;
}

export interface IPlayerThoughtsFile {
  playerThoughts: IAudio[];
}

export interface IRadioFile {
  radio: IAudio[];
}

export interface IBaseTrigger {
  trigger: string;
}
