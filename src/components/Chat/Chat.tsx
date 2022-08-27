import { useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { IMessage, IMessageDataType, INpcMessageData, IPlayerMessageData, PLAYER } from '../../types';
import { equalizeHierarchyLevel, getMessageParent, getMsgIndxOnMsgLevel, updateMessageByTagAndRemoveTag } from '../../utils';
import { ChatInput } from './ChatInput';
import { Messages } from './Messages';

export interface ChatProps {
  messages: IMessage[];
  onChangeMessages: Function;
}

export const Chat = (props: ChatProps) => {
  const [editMsg, setEditMsg] = useState<IMessageDataType | undefined>();
  const [clickedMessage, setClickedMessage] = useState<IMessageDataType | undefined>();
  const [restructurePhase, setRestructurePhase] = useState<number>(0);
  const [restructureFromData, setRestructureFromData] = useState<IMessage[]>([]);
  const [restructureToData, setRestructureToData] = useState<IMessage | undefined>();

  const onSubmit = (msg: IMessageDataType) => {
    if (editMsg) {
      const updatedMessages = updateMessageByTagAndRemoveTag(props.messages, msg, 'isEditing');
      props.onChangeMessages(updatedMessages);
      setEditMsg(undefined);
      console.log(updatedMessages);
    } else {
      const messagesToMutate = [...props.messages];
      if (msg.author === PLAYER) {
        messagesToMutate.push({
          playerMessageData: [msg as IPlayerMessageData],
        });
      } else {
        messagesToMutate.push({
          npcMessageData: msg as INpcMessageData,
        });
      }
      props.onChangeMessages(messagesToMutate);
    }
  };

  const onChangeMessages = (messages: IMessage[]) => {
    setClickedMessage(undefined);
    props.onChangeMessages(messages);
  };

  const onEditMessage = (message: IMessageDataType, messages: IMessage[]) => {
    setClickedMessage(undefined);
    setEditMsg(message);
    props.onChangeMessages(messages);
  };

  const onClickMessage = (message: IMessageDataType) => {
    if (clickedMessage === message) setClickedMessage(undefined);
    else setClickedMessage(message);
  };

  const onRestructureFromDataChange = (msg: IMessage, checked: boolean) => {
    if (!restructurePhase) return;
    if (!restructureFromData.length) setRestructureFromData([msg]);
    else if (restructureFromData.length && !checked && msg === restructureFromData[0]) setRestructureFromData([]);
    else {
      const msgs = equalizeHierarchyLevel(props.messages, restructureFromData[0], msg);
      if (checked) {
        const msg1Indx = getMsgIndxOnMsgLevel(props.messages, msgs[0]);
        const msg2Indx = getMsgIndxOnMsgLevel(props.messages, msgs[1]);
        const parent = getMessageParent(props.messages, msgs[0]);
        let messagesOnLevel = props.messages;
        if (parent !== msgs[0]) {
          for (const dataItem of parent.playerMessageData!) {
            if (dataItem.fork?.includes(msgs[0])) {
              messagesOnLevel = dataItem.fork;
              break;
            }
          }
        }
        if (msg1Indx > msg2Indx) {
          setRestructureFromData(messagesOnLevel.slice(msg2Indx, msg1Indx + 1));
        } else {
          setRestructureFromData(messagesOnLevel.slice(msg1Indx, msg2Indx + 1));
        }
      } else {
        const indx = restructureFromData.indexOf(msgs[1]);
        setRestructureFromData(restructureFromData.slice(0, indx));
      }
    }
  };

  const onRestructureToDataChange = (msg: IMessage) => {
    setRestructureToData(msg);
  }

  const onRestructureCancel = () => {
    setRestructurePhase(restructurePhase - 1);
    setRestructureFromData([]);
  };

  const onRestructureGoBack = () => {
    setRestructurePhase(restructurePhase - 1);
    setRestructureToData(undefined);
  };

  const onRestructureSubmit = () => {
    setRestructurePhase(0);
    setRestructureFromData([]);
    setRestructureToData(undefined);
    console.log(restructureFromData, restructureToData);
  };

  const renderRestructureActions = () => {
    switch (restructurePhase) {
      case 0:
        return <Button onClick={() => setRestructurePhase(restructurePhase + 1)}>Restructure</Button>
      case 1:
        return (
          <ButtonGroup>
            <Button onClick={onRestructureCancel}>Cancel</Button>
            <Button onClick={() => setRestructurePhase(restructurePhase + 1)}>Next</Button>
          </ButtonGroup>
        );
      case 2:
        return (
          <ButtonGroup>
            <Button onClick={onRestructureGoBack}>Back</Button>
            <Button onClick={onRestructureSubmit}>Submit</Button>
          </ButtonGroup>
        );
    }
  };

  return (
    <div className='chat'>
      <div className='chat-header'>
        {renderRestructureActions()}
      </div>
      <div className='messages'>
        <Messages
          data={props.messages}
          onChangeMessages={onChangeMessages}
          onEditMessage={onEditMessage}
          onClick={onClickMessage}
          clickedMsg={clickedMessage}
          restructurePhase={restructurePhase}
          restructureFromData={restructureFromData}
          restructureToData={restructureToData}
          onRestructureFromDataChange={onRestructureFromDataChange}
          onRestructureToDataChange={onRestructureToDataChange}
        />
      </div>
      <ChatInput
        members={['Joe']}
        onSubmit={onSubmit}
        editMessage={editMsg}
      />
    </div>
  );
}