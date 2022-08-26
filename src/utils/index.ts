import { IMessage, IMessageData, INpcMessageData, IPlayerMessageData } from '../types';

export function getAllMessages(list: IMessage[]): any {
  const res = [];
  for (const message of list) {
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (dataItem.text) res.push(dataItem.text);
        if (dataItem.fork) res.push(...getAllMessages(dataItem.fork));
      }
    } else if (message.messageData) {
      res.push(message.messageData.text);
    }
  }
  return res;
}

export function validateMessages(messages: IMessage[]): boolean {
  for (const message of messages) {
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (!dataItem.text || !dataItem.type) return false;
        if (!dataItem.fork) continue;
        if (!validateMessages(dataItem.fork)) return false;
      }
    } else if (message.messageData) {
      if (!message.messageData.text || !message.messageData.author || !message.messageData.type) return false;
    }
  }
  return true;
}

export function getAllAuthors(messages: IMessage[]): string[] {
  const authors: string[] = [];
  for (const message of messages) {
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (!dataItem.fork) continue;
        authors.push(...getAllAuthors(dataItem.fork).filter(x => !authors.includes(x)));
      }
    } else if (message.messageData) {
      if (!authors.includes(message.messageData.author)) authors.push(message.messageData.author);
    }
  }
  return authors;
}

export function removeField(messages: IMessage[], field: keyof IMessageData) {
  const result = [...messages];
  for (const message of result) {
    if (message.messageData) {
      delete message.messageData[field];
    } else if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        delete dataItem[field];
        if (dataItem.fork) dataItem.fork = removeField(dataItem.fork, field);
      }
    }
  }
  return result;
}

export function updateMessageByTagAndRemoveTag(messages: IMessage[], value: IMessageData, tag: keyof IMessageData) {
  const result = [...messages];
  for (const message of result) {
    if (message.messageData && message.messageData[tag]) {
      message.messageData = value as INpcMessageData;
      delete message.messageData[tag];
      return result;
    }
    if (message.playerMessageData) {
      for (const dataItemIndx in message.playerMessageData) {
        if (message.playerMessageData[dataItemIndx][tag]) {
          message.playerMessageData[dataItemIndx] = value as IPlayerMessageData;
          delete message.playerMessageData[dataItemIndx][tag];
          return result;
        }
        const fork = message.playerMessageData[dataItemIndx].fork;
        if (fork) {
          message.playerMessageData[dataItemIndx].fork = updateMessageByTagAndRemoveTag(fork, value, tag);
        }
      }
    }
  }
  return result;
}
