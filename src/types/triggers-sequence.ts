import { IMessage } from './message';

export interface TriggersSequence {
  triggers: TriggerInfo[];
}

export interface TriggerInfo {
  value?: string;
  fork?: TriggersSequence[];
  id?: string;
}

export interface ChatRefList {
  chatName: string;
  ref: IMessage;
}
