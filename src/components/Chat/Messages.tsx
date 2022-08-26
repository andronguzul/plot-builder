import React from 'react';
import { IMessage, IMessageDataType, INpcMessageData, IPlayerMessageData, MessageType, PLAYER } from '../../types';
import { removeField } from '../../utils';
import { Message } from './Message';

export interface MessagesProps {
  data: IMessage[];
  onChangeMessages: Function;
  onEditMessage: Function;
  onClick: Function;
  clickedMsg?: IMessageDataType;
  selectionMode: boolean;
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
      messageToMutate.messageData!.isEditing = true;
      msg = messageToMutate.messageData!;
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
      const msg: INpcMessageData = {
        author: messagesToMutate[msgIndx].messageData!.author,
        text: '',
        isEditing: true,
        type: MessageType.Text,
      };
      messagesToMutate.splice(msgIndx + 1, 0, {
        messageData: msg
      });
      props.onEditMessage(msg, messagesToMutate);
    }
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
                  onClick={() => props.onClick(dataItem)}
                  thisClicked={dataItem === props.clickedMsg}
                  someClicked={someOptionClicked}
                  onAddDataItem={() => onAdd(msgIndx, dataItemIndx)}
                  onAddMessage={() => onAdd(msgIndx)}
                  onRemove={() => {}}
                  onFork={() => {}}
                  selectionMode={props.selectionMode}
                />
              ) :
              <Message
                author={msg.messageData!.author}
                text={msg.messageData!.text}
                onEdit={() => onEdit(msgIndx)}
                onClick={() => props.onClick(msg)}
                thisClicked={msg === props.clickedMsg}
                onAddMessage={() => onAdd(msgIndx)}
                onRemove={() => {}}
                selectionMode={props.selectionMode}
              />
            }
            {selectedOption?.fork &&
              <Messages
                data={selectedOption.fork}
                onChangeMessages={(fork: IMessage[]) => onForkChangeMessages(fork, msgIndx, selectedOptionIndx)}
                onEditMessage={(msg: IMessageDataType, fork: IMessage[]) => onForkEdit(msg, fork, msgIndx, selectedOptionIndx)}
                onClick={props.onClick}
                clickedMsg={props.clickedMsg}
                selectionMode={props.selectionMode}
              />
            }
          </React.Fragment>
        );
      })}
    </div>
  );
}