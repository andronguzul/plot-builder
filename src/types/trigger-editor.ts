export interface IParsedTrigger {
  key: TriggerType;
  value: string;
}

export enum TriggerType {
  NEXT_EPISODE = 'next-episode',
  ROOM_ANIMATION = 'room-animation',
  PLAYER_THOUGHTS = 'player-thoughts',
  RADIO = 'radio',
  MECHANICS = 'mechanics',
  NEXT_CHAT = 'next-chat',
  TIME_LIMIT_START = 'time-limit-start',
  TIME_LIMIT_STOP = 'time-limit-stop',
  MUSIC_START = 'music-start',
  MUSIC_STOP = 'music-stop',
  SAVE = 'save',
  AFFECT_FUTURE = 'affect-future',
  AFFECTED_BY_PAST = 'affected-by-past',
}

export class ParsedTriggerList {
  static includes(triggers: IParsedTrigger[], triggerType: TriggerType): boolean {
    return triggers.some(x => x.key === triggerType);
  }

  static add(triggers: IParsedTrigger[], triggerType: TriggerType): IParsedTrigger[] {
    const triggersToMutate = [...triggers];
    triggersToMutate.push({
      key: triggerType,
      value: '',
    });
    return triggersToMutate;
  }

  static remove(triggers: IParsedTrigger[], triggerType: TriggerType): IParsedTrigger[] {
    const triggersToMutate = [...triggers];
    const trigger = triggersToMutate.find(x => x.key === triggerType);
    if (!trigger) return triggers;
    const indx = triggersToMutate.indexOf(trigger);
    triggersToMutate.splice(indx, 1);
    return triggersToMutate;
  }

  static getRawTrigger(triggers: IParsedTrigger[]): string {
    return triggers.map(trigger => `${trigger.key}:${trigger.value}`).join('_');
  }

  static parseRawTrigger(trigger: string): IParsedTrigger[] {
    const separatedTriggers = trigger.split('_');
    return separatedTriggers.map(trigger => {
      const divided = trigger.split(':');
      return {
        key: divided[0] as TriggerType,
        value: divided[1],
      }
    });
  }

  static sortTriggers(triggers: IParsedTrigger[]): IParsedTrigger[] {
    const res: IParsedTrigger[] = [];
    for (const key of Object.values(TriggerType)) {
      const trigger = triggers.find(x => x.key === key);
      if (trigger) {
        res.push(trigger);
      }
    }
    return res;
  }

  static getValue(triggers: IParsedTrigger[], triggerType: TriggerType): string | null {
    const trigger = triggers.find(x => x.key === triggerType);
    if (!trigger) return null;
    return trigger.value;
  }

  static changeValue(triggers: IParsedTrigger[], triggerType: TriggerType, value: string): IParsedTrigger[] {
    const triggersToMutate = [...triggers];
    const trigger = triggersToMutate.find(x => x.key === triggerType);
    if (!trigger) return triggers;
    const indx = triggersToMutate.indexOf(trigger);
    triggersToMutate[indx].value = value;
    return triggersToMutate;
  }
}