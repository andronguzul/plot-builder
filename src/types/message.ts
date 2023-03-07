export const PLAYER = 'Me';

export enum MessageType {
  Text = 'text',
  File = 'file',
}

export interface IMessageData {
  id: string;
  type: MessageType;
  author: string;
  filename?: string;
  file_meta?: string;
  text?: string;
  isEditing?: boolean;
  trigger?: string;
  timeLimitInSeconds?: number;
}

export interface INpcMessageData extends IMessageData { }

export interface IPlayerMessageData extends IMessageData {
  selected: boolean;
  fork?: IMessage[];
}

export type IMessageDataType = INpcMessageData | IPlayerMessageData;

export interface IMessage {
  npcMessageData?: INpcMessageData;
  playerMessageData?: IPlayerMessageData[];
}

export interface IChat {
  members: string[];
  messages: IMessage[];
}