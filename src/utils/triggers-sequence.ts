import { ImportResult } from '../components/TriggersSequence/ImportBox/ImportStep';
import { IChat, IMessage, ParsedTriggerList, TriggerType } from '../types';
import { TriggerInfo, TriggersSequence } from '../types/triggers-sequence';

interface ChatTriggersSequence {
  chatName: string;
  triggers: TriggerInfo[];
}

interface TriggerRef {
  chatName: string;
  parentChatName: string;
  refId?: string;
}

interface RefsCopy {
  refs: TriggerRef[];
}

interface GetConnectedTriggersSequencePayload {
  currChat: ChatTriggersSequence;
  chats: ChatTriggersSequence[];
  refs: TriggerRef[];
  refId?: string;
}

export function getTriggersSequence(chatName: string, chats: ImportResult[]): TriggerInfo[] {
  const sequences: ChatTriggersSequence[] = [];
  for (const chat of chats) {
    const chatContent: IChat = JSON.parse(chat.data);
    sequences.push({
      chatName: chat.fileName,
      triggers: getChatTriggersSequence(chatContent.messages),
    });
  }

  const firstChat = sequences.find(x => x.chatName === chatName);
  if (!firstChat) {
    throw new Error(`${chatName} was not found!`);
  }

  return getConnectedTriggersSequence({
    currChat: firstChat,
    chats: sequences,
    refs: [],
  });
}

function getConnectedTriggersSequence(payload: GetConnectedTriggersSequencePayload): TriggerInfo[] {
  let connectedTriggers: TriggerInfo[] = [];
  const ref = !payload.refId ? payload.refs.find(x => x.chatName === payload.currChat.chatName) : undefined;
  let refReached = false;

  for (const triggerInfo of payload.currChat.triggers) {
    if (triggerInfo.value) {
      if (payload.refId && !refReached) {
        if (triggerInfo.id === payload.refId) {
          refReached = true;
        }
        continue;
      } else if (ref && ref.refId && !refReached) {
        if (triggerInfo.id === ref.refId) {
          refReached = true;
        }
        continue;
      }

      connectedTriggers.push({
        value: triggerInfo.value,
        id: triggerInfo.id,
      });
      const nextChatName = getNextChatName(triggerInfo.value);
      if (nextChatName) {
        if (shouldGoBack(payload.currChat.chatName, nextChatName, payload.refs)) {
          const ref = payload.refs.find(x => x.chatName === payload.currChat.chatName)!;
          payload.refs[payload.refs.indexOf(ref)].refId = triggerInfo.id;
          break;
        }
        const ref = payload.refs.find(x => x.chatName === nextChatName && x.parentChatName === payload.currChat.chatName);
        if (!ref) {
          payload.refs.push({
            chatName: nextChatName,
            parentChatName: payload.currChat.chatName,
          });
        }

        const chat = payload.chats.find(x => x.chatName === nextChatName)!;
        const nextChatTriggers = getConnectedTriggersSequence({
          currChat: chat,
          chats: payload.chats,
          refs: payload.refs,
        });
        connectedTriggers.push(...nextChatTriggers);
        const nextChatLastTrigger = nextChatTriggers[nextChatTriggers.length - 1];
        if (nextChatLastTrigger) {
          const nextChatLastTriggerChatName = getNextChatName(nextChatLastTrigger.value!);
          if (nextChatLastTriggerChatName && shouldGoBack(payload.currChat.chatName, nextChatLastTriggerChatName, payload.refs)) {
            const ref = payload.refs.find(x => x.chatName === payload.currChat.chatName)!;
            payload.refs[payload.refs.indexOf(ref)].refId = triggerInfo.id;
            break;
          }
        }
      }
    } else if (triggerInfo.fork) {
      const fork: TriggersSequence[] = [];
      const copies: RefsCopy[] = [];
      for (const forkItem of triggerInfo.fork) {
        const refsCopy = JSON.parse(JSON.stringify(payload.refs));
        fork.push({
          triggers: getConnectedTriggersSequence({
            currChat: {
              chatName: payload.currChat.chatName,
              triggers: forkItem.triggers,
            },
            chats: payload.chats,
            refs: refsCopy,
            refId: ref?.refId,
          }),
        });
        copies.push({
          refs: refsCopy,
        });
      }
      payload.refs = getUniqueRefsFromCopies(copies);
      connectedTriggers.push({
        fork,
      });
    }
  }
  return connectedTriggers;
}

function getUniqueRefsFromCopies(copies: RefsCopy[]): TriggerRef[] {
  const refs: TriggerRef[] = [];
  for (const copy of copies) {
    for (const ref of copy.refs) {
      if (!refs.some(x => x.chatName === ref.chatName && x.parentChatName === ref.parentChatName)) {
        refs.push(ref);
      }
    }
  }
  return refs;
}

function shouldGoBack(currChatName: string, nextChatName: string, refs: TriggerRef[]): boolean {
  const firstRef = refs.find(x => x.chatName === currChatName);
  if (!firstRef) return false;
  let currRef = firstRef;
  while (true) {
    if (currRef.parentChatName === nextChatName) {
      return true;
    }
    const nextRef = refs.find(x => x.chatName === currRef.parentChatName);
    if (!nextRef) {
      return false;
    }
    currRef = nextRef;
  }
}

function getChatTriggersSequence(messages: IMessage[]): TriggerInfo[] {
  const triggers: TriggerInfo[] = [];
  for (const message of messages) {
    if (message.npcMessageData?.trigger) {
      const trigger = message.npcMessageData.trigger;
      triggers.push({
        value: trigger,
        id: message.npcMessageData.id,
      });
    } else if (message.playerMessageData) {
      const fork: TriggersSequence[] = [];
      for (const dataItem of message.playerMessageData) {
        const forkItem: TriggerInfo[] = [];
        if (dataItem.trigger) {
          const trigger = dataItem.trigger;
          forkItem.push({
            value: trigger,
            id: dataItem.id,
          });
        }
        if (dataItem.fork) {
          forkItem.push(...getChatTriggersSequence(dataItem.fork));
        }
        if (forkItem.length) {
          fork.push({
            triggers: forkItem,
          });
        }
      }
      if (fork.length) {
        if (fork.length === 1) {
          triggers.push(...fork[0].triggers);
        } else {
          triggers.push({
            fork,
          });
        }
      }
    }
  }
  return triggers;
}

function getNextChatName(trigger: string): string | null {
  const parsedTriggers = ParsedTriggerList.parseRawTrigger(trigger);
  if (ParsedTriggerList.includes(parsedTriggers, TriggerType.NEXT_CHAT)) {
    return ParsedTriggerList.getValue(parsedTriggers, TriggerType.NEXT_CHAT);
  }
  return null;
}
