import { useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { IMessage, IMessageDataType, INpcMessageData, IPlayerMessageData, PLAYER } from '../../types';
import { equalizeHierarchyLevel, getMessageParent, getMsgIndxOnMsgLevel, messageExists, restructureMessages, updateFork, updateMessageByTagAndRemoveTag } from '../../utils';
import { ChatInput } from './ChatInput';
import { Messages } from './Messages';
import { ParseModal } from './ParseModal';

export interface ChatProps {
  messages: IMessage[];
  members: string[];
  onChangeMessages: Function;
}

export const Chat = (props: ChatProps) => {
  const [editMsg, setEditMsg] = useState<IMessageDataType | undefined>();
  const [clickedMessage, setClickedMessage] = useState<IMessageDataType | undefined>();
  const [restructurePhase, setRestructurePhase] = useState<number>(0);
  const [restructureFromData, setRestructureFromData] = useState<IMessage[]>([]);
  const [restructureToData, setRestructureToData] = useState<IPlayerMessageData | undefined>();
  const [forkChain, setForkChain] = useState<IPlayerMessageData[]>([]);
  const [currentFork, setCurrentFork] = useState<IPlayerMessageData | undefined>();
  const [parseModalOpen, setParseModalOpen] = useState<boolean>(false);

  const messages = (currentFork && (currentFork.fork || [])) || props.messages;

  const getMessages = (messages: IMessage[]) => {
    if (!currentFork) return messages;
    return updateFork(props.messages, currentFork, messages);
  };

  const onSubmit = (msg: IMessageDataType) => {
    if (editMsg) {
      const updatedMessages = updateMessageByTagAndRemoveTag(messages, msg, 'isEditing');
      props.onChangeMessages(getMessages(updatedMessages));
      setEditMsg(undefined);
    } else {
      const messagesToMutate = [...messages];
      if (msg.author === PLAYER) {
        messagesToMutate.push({
          playerMessageData: [msg as IPlayerMessageData],
        });
      } else {
        messagesToMutate.push({
          npcMessageData: msg as INpcMessageData,
        });
      }
      props.onChangeMessages(getMessages(messagesToMutate));
    }
  };

  const onChangeMessages = (messages: IMessage[]) => {
    setClickedMessage(undefined);
    props.onChangeMessages(getMessages(messages));
  };

  const onEditMessage = (message: IMessageDataType, messages: IMessage[]) => {
    setClickedMessage(undefined);
    setEditMsg(message);
    console.log(messages);
    props.onChangeMessages(getMessages(messages));
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
      const msgs = equalizeHierarchyLevel(messages, restructureFromData[0], msg);
      if (checked) {
        const msg1Indx = getMsgIndxOnMsgLevel(messages, msgs[0]);
        const msg2Indx = getMsgIndxOnMsgLevel(messages, msgs[1]);
        const parent = getMessageParent(messages, msgs[0]);
        let messagesOnLevel = messages;
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

  const onRestructureToDataChange = (msg: IMessage, dataItemIndx: number) => {
    if (!msg.playerMessageData) return;
    if (messageExists(restructureFromData, msg)) return;
    setRestructureToData(msg.playerMessageData[dataItemIndx]);
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
    const messagesToUpdate = restructureMessages(messages, restructureFromData, restructureToData);
    props.onChangeMessages(getMessages(messagesToUpdate));
  };

  const renderRestructureActions = () => {
    switch (restructurePhase) {
      case 0:
        return <Button onClick={() => setRestructurePhase(restructurePhase + 1)}>Restructure</Button>
      case 1:
        return (
          <>
            <Button onClick={onRestructureCancel}>Cancel</Button>
            <Button onClick={() => setRestructurePhase(restructurePhase + 1)}>Next</Button>
          </>
        );
      case 2:
        return (
          <>
            <Button onClick={onRestructureGoBack}>Back</Button>
            <Button onClick={onRestructureSubmit}>Submit</Button>
          </>
        );
    }
  };

  const onFork = (dataItem: IPlayerMessageData) => {
    setForkChain([...forkChain, dataItem]);
    setCurrentFork(dataItem);
  };

  const onForkBack = () => {
    if (!currentFork) return;
    const currentForkIndx = forkChain.indexOf(currentFork);
    if (currentForkIndx === 0) {
      setCurrentFork(undefined);
      setForkChain([]);
    } else {
      setCurrentFork(forkChain[currentForkIndx - 1])
      setForkChain(forkChain.slice(0, currentForkIndx));
    }
  };

  return (
    <div className='chat'>
      <div className={`chat-header ${!currentFork ? 'right' : ''}`}>
        {currentFork && <Button onClick={onForkBack}>Back</Button>}
        <ButtonGroup>
          {renderRestructureActions()}
          <Button onClick={() => setParseModalOpen(true)}>Parse</Button>
        </ButtonGroup>
      </div>
      <div className='messages'>
        <Messages
          data={messages}
          onChangeMessages={onChangeMessages}
          onEditMessage={onEditMessage}
          onClick={onClickMessage}
          clickedMsg={clickedMessage}
          restructurePhase={restructurePhase}
          restructureFromData={restructureFromData}
          restructureToData={restructureToData}
          onRestructureFromDataChange={onRestructureFromDataChange}
          onRestructureToDataChange={onRestructureToDataChange}
          onFork={onFork}
        />
      </div>
      <ChatInput
        members={props.members}
        onSubmit={onSubmit}
        editMessage={editMsg}
      />
      <ParseModal
        members={props.members}
        open={parseModalOpen}
        onClose={(messages: IMessage[] | undefined) => {
          if (messages && !currentFork) {
            props.onChangeMessages([...props.messages, ...messages]);
          }
          setParseModalOpen(false);
        }}
      />
    </div>
  );
}