import { IMessage, IMessageData, INpcMessageData, IPlayerMessageData } from '../types';

export function getAllMessages(list: IMessage[]): any {
  const res = [];
  for (const message of list) {
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (dataItem.text) res.push(dataItem.text);
        if (dataItem.fork) res.push(...getAllMessages(dataItem.fork));
      }
    } else if (message.npcMessageData) {
      res.push(message.npcMessageData.text);
    }
  }
  return res;
}

export function validateMessages(messages: IMessage[]): boolean {
  for (const message of messages) {
    if (!message.playerMessageData && !message.npcMessageData) return false;
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (!dataItem.text || !dataItem.type) return false;
        if (!dataItem.fork) continue;
        if (!validateMessages(dataItem.fork)) return false;
      }
    } else {
      if (!message.npcMessageData!.text || !message.npcMessageData!.author || !message.npcMessageData!.type) return false;
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
    } else if (message.npcMessageData) {
      if (!authors.includes(message.npcMessageData.author)) authors.push(message.npcMessageData.author);
    }
  }
  return authors;
}

export function removeField(messages: IMessage[], field: keyof IMessageData) {
  const result = [...messages];
  for (const message of result) {
    if (message.npcMessageData) {
      delete message.npcMessageData[field];
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
    if (message.npcMessageData && message.npcMessageData[tag]) {
      message.npcMessageData = value as INpcMessageData;
      delete message.npcMessageData[tag];
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

export function messageExists(messages: IMessage[], value: IMessage): boolean {
  for (const message of messages) {
    if (message === value) return true;
    if (message.playerMessageData) {
      for (const dataItem of message.playerMessageData) {
        if (dataItem.fork && messageExists(dataItem.fork, value)) return true;
      }
    }
  }
  return false;
}

export function getMsgIndxOnMsgLevel(messages: IMessage[], searchingMessage: IMessage): number {
  for (const i in messages) {
    const msgIndx = parseInt(i);
    const msg = messages[msgIndx];
    if (msg === searchingMessage) return msgIndx;
    if (msg.playerMessageData) {
      for (const dataItem of msg.playerMessageData) {
        if (dataItem.fork) {
          const forkMsgIndx = getMsgIndxOnMsgLevel(dataItem.fork, searchingMessage);
          if (forkMsgIndx !== -1) return forkMsgIndx;
        }
      }
    }
  }
  return -1;
}

export function equalizeHierarchyLevel(messages: IMessage[], message1: IMessage, message2: IMessage): IMessage[] {
  const message1Level = calculateHierarchyLevel(messages, message1);
  const message2Level = calculateHierarchyLevel(messages, message2);
  let result = [message1, message2];
  if (message1Level > message2Level) result[0] = getMessageParent(messages, message1, message1Level - message2Level);
  else result[1] = getMessageParent(messages, message2, message2Level - message1Level);
  return result;
}

export function calculateHierarchyLevel(messages: IMessage[], searchingMessage: IMessage, startLevel = 0): number {
  for (const msg of messages) {
    if (msg === searchingMessage) return startLevel;
    if (msg.playerMessageData) {
      for (const dataItem of msg.playerMessageData) {
        if (dataItem.fork) {
          const level = calculateHierarchyLevel(dataItem.fork, searchingMessage, startLevel + 1);
          if (level !== -1) return level;
        }
      }
    }
  }
  return -1;
}

export function getMessageParent(messages: IMessage[], searchingMessage: IMessage, levelToUp = 1): IMessage {
  const getParent = (messages: IMessage[], searchingMessage: IMessage): IMessage => {
    for (const msg of messages) {
      if (msg === searchingMessage) return msg;
      if (msg.playerMessageData) {
        for (const dataItem of msg.playerMessageData) {
          if (dataItem.fork && getParent(dataItem.fork, searchingMessage)) {
            return msg;
          }
        }
      }
    }
    return searchingMessage;
  }
  let counter = 0;
  let result: IMessage = searchingMessage;
  while (counter++ < levelToUp) {
    result = getParent(messages, result);
  }
  return result;
}

export function restructureMessages(messages: IMessage[], group: IMessage[], target?: IPlayerMessageData): IMessage[] {
  let messagesToMutate = [...messages];
  let rootParentIndx = getRootParentIndex(messages, group);

  messagesToMutate = removeMessagesFromChildren(messagesToMutate, group);

  messagesToMutate = target ?
    insertMessagesToTarget(messagesToMutate, group, target) :
    insertMessagesToRoot(messagesToMutate, group, rootParentIndx);

  return messagesToMutate;
}

export function getRootParentIndex(messages: IMessage[], group: IMessage[]): number {
  const groupLevel = calculateHierarchyLevel(messages, group[0]);
  const rootParent = getMessageParent(messages, group[0], groupLevel);
  return messages.indexOf(rootParent);
}

export function removeMessagesFromChildren(messages: IMessage[], group: IMessage[]): IMessage[] {
  const messagesToMutate = [...messages];
  if (messagesToMutate.includes(group[0])) {
    messagesToMutate.splice(messagesToMutate.indexOf(group[0]), group.length);
  } else {
    for (const message of messagesToMutate) {
      if (!message.playerMessageData) continue;
      for (const dataItem of message.playerMessageData) {
        if (dataItem.fork) {
          if (dataItem.fork.includes(group[0])) {
            dataItem.fork.splice(dataItem.fork.indexOf(group[0]), group.length);
          } else {
            dataItem.fork = removeMessagesFromChildren(dataItem.fork, group);
          }
        }
      }
    }
  }
  return messagesToMutate;
}

export function insertMessagesToTarget(messages: IMessage[], group: IMessage[], target: IPlayerMessageData): IMessage[] {
  const messagesToMutate = [...messages];
  for (const mi in messagesToMutate) {
    const msgIndx = parseInt(mi);
    if (!messagesToMutate[msgIndx].playerMessageData) continue;
    for (const di in messagesToMutate[msgIndx].playerMessageData) {
      const dataItemIndx = parseInt(di);
      const dataItem = messagesToMutate[msgIndx].playerMessageData?.[dataItemIndx];
      if (dataItem === target) {
        if (!dataItem.fork) {
          messagesToMutate[msgIndx].playerMessageData![dataItemIndx].fork = group;
        } else {
          messagesToMutate[msgIndx].playerMessageData![dataItemIndx].fork!.push(...group);
        }
        break;
      } else {
        if (dataItem?.fork) {
          messagesToMutate[msgIndx].playerMessageData![dataItemIndx].fork = insertMessagesToTarget(dataItem?.fork, group, target);
        }
      }
    }
  }
  return messagesToMutate;
}

export function insertMessagesToRoot(messages: IMessage[], group: IMessage[], rootParentIndx: number): IMessage[] {
  const messagesToMutate = [...messages];
  messagesToMutate.splice(rootParentIndx + 1, 0, ...group);
  return messagesToMutate;
}

export function updateFork(messages: IMessage[], messageToUpdate: IPlayerMessageData, fork: IMessage[]): IMessage[] {
  const messagesToMutate = [...messages];
  for (const message of messagesToMutate) {
    if (!message.playerMessageData) continue;
    for (const dataItem of message.playerMessageData) {
      if (dataItem === messageToUpdate) dataItem.fork = fork;
      else if (dataItem.fork) {
        dataItem.fork = updateFork(dataItem.fork, messageToUpdate, fork);
      }
    }
  }
  return messagesToMutate;
}