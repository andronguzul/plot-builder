import React from 'react';
import { IMessage, IMessageDataType, INpcMessageData, IPlayerMessageData, MessageType, PLAYER } from '../../types';
import { messageExists, removeField } from '../../utils';
import { Message } from './Message';

export interface MessagesProps {
  data: IMessage[];
  onChangeMessages: Function;
  onEditMessage: Function;
  onClick: Function;
  clickedMsg?: IMessageDataType;
  restructurePhase: number;
  restructureFromData: IMessage[];
  restructureToData?: IPlayerMessageData;
  onRestructureFromDataChange?: Function;
  onRestructureToDataChange?: Function;
  onFork: Function;
}

export const Messages = (props: MessagesProps) => {
  const onSelectMessage = (msgIndx: number, dataItemIndx: number) => {
    const messagesToMutate = [...props.data];
    const messageToMutate = messagesToMutate[msgIndx];
    if (messageToMutate.playerMessageData) {
      for (const i in messageToMutate.playerMessageData) {
        const indx = parseInt(i);
        messageToMutate.playerMessageData[indx].selected = dataItemIndx === indx ? true : false;
      }
    }
    props.onChangeMessages(messagesToMutate);
  };

  const onEdit = (msgIndx: number, dataItemIndx?: number) => {
    const messagesToMutate = removeField(props.data, 'isEditing');
    const messageToMutate = messagesToMutate[msgIndx];
    let msg: IMessageDataType;
    if (dataItemIndx !== undefined) {
      messageToMutate.playerMessageData![dataItemIndx].isEditing = true;
      msg = messageToMutate.playerMessageData![dataItemIndx];
    } else {
      messageToMutate.npcMessageData!.isEditing = true;
      msg = messageToMutate.npcMessageData!;
    }
    props.onEditMessage(msg, messagesToMutate);
  };

  const onAdd = (msgIndx: number, dataItemIndx?: number) => {
    const messagesToMutate = removeField(props.data, 'isEditing');
    const messageToMutate = messagesToMutate[msgIndx];
    if (dataItemIndx !== undefined) {
      for (const option of messageToMutate.playerMessageData!) {
        option.selected = false;
      }
      const msg: IPlayerMessageData = {
        author: PLAYER,
        text: '',
        isEditing: true,
        selected: true,
        type: MessageType.Text,
      };
      messageToMutate.playerMessageData!.push(msg);
      props.onEditMessage(msg, messagesToMutate);
    } else {
      const previousMsg = messagesToMutate[msgIndx];
      if (previousMsg.npcMessageData) {
        const msg: INpcMessageData = {
          author: previousMsg.npcMessageData.author,
          text: '',
          isEditing: true,
          type: MessageType.Text,
        };
        messagesToMutate.splice(msgIndx + 1, 0, {
          npcMessageData: msg
        });
        props.onEditMessage(msg, messagesToMutate);
      } else {
        const msg: IPlayerMessageData = {
          author: PLAYER,
          text: '',
          isEditing: true,
          type: MessageType.Text,
          selected: true,
        };
        messagesToMutate.splice(msgIndx + 1, 0, {
          playerMessageData: [msg]
        });
        props.onEditMessage(msg, messagesToMutate);
      }
    }
  };

  const onRemove = (msgIndx: number, dataItemIndx?: number) => {
    const messagesToMutate = [...props.data];
    if (dataItemIndx !== undefined) {
      messagesToMutate[msgIndx].playerMessageData?.splice(dataItemIndx, 1);
    } else {
      messagesToMutate.splice(msgIndx, 1);
    }
    props.onChangeMessages(messagesToMutate);
  };

  const onTriggerValueChange = (value: string, msgIndx: number, dataItemIndx?: number) => {
    const messagesToMutate = [...props.data];
    if (dataItemIndx !== undefined) {
      messagesToMutate[msgIndx].playerMessageData![dataItemIndx].trigger = value;
    } else {
      messagesToMutate[msgIndx].npcMessageData!.trigger = value;
    }
    props.onChangeMessages(messagesToMutate);
  };

  const onForkChangeMessages = (fork: IMessage[], msgIndx: number, dataItemIndx: number) => {
    const messagesToMutate = [...props.data];
    messagesToMutate[msgIndx].playerMessageData![dataItemIndx].fork = fork;
    props.onChangeMessages(messagesToMutate);
  };

  const onForkEdit = (msg: IMessageDataType, fork: IMessage[], msgIndx: number, optionIndx: number) => {
    const messagesToMutate = [...props.data];
    messagesToMutate[msgIndx].playerMessageData![optionIndx].fork = fork;
    props.onEditMessage(msg, messagesToMutate);
  };

  return (
    <div>
      {props.data.map((msg, msgIndx) => {
        const selectedOption = msg.playerMessageData?.find(x => x.selected)!;
        const selectedOptionIndx = msg.playerMessageData?.indexOf(selectedOption) || 0;
        const someOptionClicked = msg.playerMessageData?.some(o => o === props.clickedMsg);
        const existsInRestructureFromData = props.restructurePhase ? messageExists(props.restructureFromData, msg) : false;
        const restructureFromDataCanBeChanged = !existsInRestructureFromData || props.restructureFromData.includes(msg);
        return (
          <React.Fragment key={msgIndx}>
            {msg.playerMessageData ?
              msg.playerMessageData.map((dataItem, dataItemIndx) =>
                <Message
                  key={dataItemIndx}
                  text={dataItem.text}
                  author={dataItem.author}
                  onEdit={() => onEdit(msgIndx, dataItemIndx)}
                  onSelectDataItem={() => onSelectMessage(msgIndx, dataItemIndx)}
                  isSelected={dataItem.selected}
                  dataItemIndx={dataItemIndx}
                  dataItemsLength={msg.playerMessageData!.length}
                  onClick={() => props.restructurePhase === 2 ? props.onRestructureToDataChange?.(msg, dataItemIndx) : props.onClick(dataItem)}
                  thisClicked={dataItem === props.clickedMsg}
                  someClicked={someOptionClicked}
                  onAddDataItem={() => onAdd(msgIndx, dataItemIndx)}
                  onAddMessage={() => onAdd(msgIndx)}
                  onRemove={() => onRemove(msgIndx, dataItemIndx)}
                  onFork={() => props.onFork(dataItem)}
                  restructurePhase={props.restructurePhase}
                  existsInRestructureFromData={existsInRestructureFromData}
                  restructureFromDataCanBeChanged={restructureFromDataCanBeChanged}
                  onRestructureFromDataChange={(statement: boolean) => props.onRestructureFromDataChange?.(msg, statement)}
                  isRestructureToData={props.restructureToData === dataItem}
                  trigger={dataItem.trigger}
                  onTriggerChange={(value: string) => onTriggerValueChange(value, msgIndx, dataItemIndx)}
                />
              ) :
              <Message
                author={msg.npcMessageData!.author}
                text={msg.npcMessageData!.text}
                onEdit={() => onEdit(msgIndx)}
                onClick={() => props.onClick(msg.npcMessageData)}
                thisClicked={msg.npcMessageData === props.clickedMsg}
                onAddMessage={() => onAdd(msgIndx)}
                onRemove={() => onRemove(msgIndx)}
                restructurePhase={props.restructurePhase}
                existsInRestructureFromData={existsInRestructureFromData}
                restructureFromDataCanBeChanged={restructureFromDataCanBeChanged}
                onRestructureFromDataChange={(statement: boolean) => props.onRestructureFromDataChange?.(msg, statement)}
                isRestructureToData={props.restructureToData === msg}
                trigger={msg.npcMessageData!.trigger}
                onTriggerChange={(value: string) => onTriggerValueChange(value, msgIndx)}
              />
            }
            {selectedOption?.fork &&
              <Messages
                data={selectedOption.fork}
                onChangeMessages={(fork: IMessage[]) => onForkChangeMessages(fork, msgIndx, selectedOptionIndx)}
                onEditMessage={(msg: IMessageDataType, fork: IMessage[]) => onForkEdit(msg, fork, msgIndx, selectedOptionIndx)}
                onClick={props.onClick}
                clickedMsg={props.clickedMsg}
                restructurePhase={props.restructurePhase}
                restructureFromData={props.restructureFromData}
                restructureToData={props.restructureToData}
                onRestructureFromDataChange={props.onRestructureFromDataChange}
                onRestructureToDataChange={props.onRestructureToDataChange}
                onFork={props.onFork}
              />
            }
          </React.Fragment>
        );
      })}
    </div>
  );
}