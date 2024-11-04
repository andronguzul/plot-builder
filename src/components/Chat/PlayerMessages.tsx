import React from 'react';
import { useState } from 'react';
import { IMessage, IMessageDataType, IPlayerMessageData, MessageType } from '../../types';
import { Message } from './Message';

export interface PlayerMessagesProps {
  msg: IMessage;
  msgIndx: number;
  onEdit: Function;
  onSelectMessage: Function;
  restructurePhase: number;
  onRestructureToDataChange?: Function;
  onClick: Function;
  clickedMsg?: IMessageDataType;
  someClicked?: boolean;
  onAdd: Function;
  onRemove: Function;
  onFork: Function;
  existsInRestructureFromData: boolean;
  restructureFromDataCanBeChanged: boolean;
  onRestructureFromDataChange?: Function;
  restructureToData?: IPlayerMessageData;
  onTriggerChange: Function;
  forkVisible?: boolean;
  onSwitchForkVisibility: Function;
}

export const PlayerMessages = (props: PlayerMessagesProps) => {
  const [longestMsg, setLongestMsg] = useState<React.RefObject<HTMLDivElement> | undefined>();
  const [longestMsgIndx, setLongestMsgIndx] = useState<number | undefined>();
  const [longestMsgLength, setLongestMsgLength] = useState<number>(0);

  const onMessageLengthChange = (r: React.RefObject<HTMLDivElement>, text: string, msgIndx: number) => {
    if (!longestMsgLength || (longestMsgLength < text.length || (text.length < longestMsgLength && msgIndx === longestMsgIndx))) {
      setLongestMsg(r);
      setLongestMsgIndx(msgIndx);
      setLongestMsgLength(text.length);
    }
  };

  return (
    <div className='player-messages-container'>
      {props.msg.playerMessageData!.map((dataItem, dataItemIndx) =>
        <Message
          key={dataItemIndx}
          text={dataItem.type === MessageType.Text ? dataItem.text :  dataItem.filename}
          type={dataItem.type}
          author={dataItem.author}
          onEdit={() => props.onEdit(props.msgIndx, dataItemIndx)}
          onSelectDataItem={() => props.onSelectMessage(props.msgIndx, dataItemIndx)}
          isSelected={dataItem.selected}
          dataItemIndx={dataItemIndx}
          dataItemsLength={props.msg.playerMessageData!.length}
          onClick={() => props.restructurePhase === 2 ? props.onRestructureToDataChange?.(props.msg, dataItemIndx) : props.onClick(dataItem)}
          thisClicked={dataItem === props.clickedMsg}
          someClicked={props.someClicked}
          onAddDataItem={() => props.onAdd(props.msgIndx, false, dataItemIndx)}
          onAddMessage={(isNpc: boolean) => props.onAdd(props.msgIndx, isNpc)}
          onRemove={() => props.onRemove(props.msgIndx, dataItemIndx)}
          onFork={() => props.onFork(dataItem)}
          restructurePhase={props.restructurePhase}
          existsInRestructureFromData={props.existsInRestructureFromData}
          restructureFromDataCanBeChanged={props.restructureFromDataCanBeChanged}
          onRestructureFromDataChange={(statement: boolean) => props.onRestructureFromDataChange?.(props.msg, statement)}
          isRestructureToData={props.restructureToData === dataItem}
          trigger={dataItem.trigger}
          onTriggerChange={(value: string) => props.onTriggerChange(value, props.msgIndx, dataItemIndx)}
          longestMessage={longestMsg}
          isTheLongestMessage={longestMsgIndx === dataItemIndx}
          onMessageDivLengthChange={(r: React.RefObject<HTMLDivElement>, text: string) => onMessageLengthChange(r, text, dataItemIndx)}
          forkVisible={props.forkVisible}
          onSwitchForkVisibility={props.onSwitchForkVisibility}
        />
      )}
    </div>
  );
}