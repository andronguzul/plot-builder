import { useState } from 'react';
import { Input } from 'reactstrap';
import { IMessage, IMessageDataType, INpcMessageData, IPlayerMessageData, PLAYER } from '../../types';
import { updateMessageByTagAndRemoveTag } from '../../utils';
import { ChatInput } from './ChatInput';
import { Messages } from './Messages';

export interface ChatProps {
  messages: IMessage[];
  onChangeMessages: Function;
}

export const Chat = (props: ChatProps) => {
  const [editMsg, setEditMsg] = useState<IMessageDataType | undefined>();
  const [clickedMessage, setClickedMessage] = useState<IMessageDataType | undefined>();
  const [selectionTurnedOn, setSelectionTurnedOn] = useState(false);
  // const [selectedMessages, setSelectedMesssages] = useState([]);

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
          messageData: msg as INpcMessageData,
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

  return (
    <div className='chat'>
      <div className='chat-header'>
        <div className='in-row'>
          <Input
            type='checkbox'
            checked={selectionTurnedOn}
            onChange={e => setSelectionTurnedOn(e.target.checked)}
          />
          <div className='checkbox-label'>Multiple Select</div>
        </div>
      </div>
      <div className='messages'>
        <Messages
          data={props.messages}
          onChangeMessages={onChangeMessages}
          onEditMessage={onEditMessage}
          onClick={onClickMessage}
          clickedMsg={clickedMessage}
          selectionMode={selectionTurnedOn}
        />
      </div>
      <ChatInput
        members={['Joe']}
        onSubmit={onSubmit}
        editMessage={editMsg}
      />
    </div>
  )
}