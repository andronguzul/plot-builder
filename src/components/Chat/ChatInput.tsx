import React, { useEffect, useRef, useState } from 'react';
import { Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { IMessageDataType, MessageType, PLAYER } from '../../types';
import { AuthorSelectorModal } from './AuthorSelectorModal';

export interface ChatInputProps {
  members: string[];
  editMessage?: IMessageDataType;
  onSubmit: Function;
}

export const ChatInput = (props: ChatInputProps) => {
  const tabs = [MessageType.Text, MessageType.File];
  const members = [...props.members, PLAYER];

  const [author, setAuthor] = useState(members[0]);
  const [message, setMessage] = useState('');
  const [filename, setFilename] = useState('');
  const [fileMeta, setFileMeta] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [isCntrlDown, setIsCntrlDown] = useState(false);
  const [isEnterDown, setIsEnterDown] = useState(false);
  const [authorSelectorModalOpened, setAuthorSelectorModalOpened] = useState(false);

  const textInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.editMessage) {
      setAuthor(props.editMessage.author);
      if (props.editMessage.type === MessageType.Text) {
        setMessage(props.editMessage.text || '');
        setActiveTab(MessageType.Text);
        textInputRef.current?.focus();
      } else {
        setMessage('');
        setFilename(props.editMessage.filename || '');
        setFileMeta(props.editMessage.file_meta || '');
        setActiveTab(MessageType.File);
        fileInputRef.current?.focus();
      }
    }
  }, [props.editMessage]);

  const switchAuthour = () => {
    const currAuthorIndx = members.indexOf(author);
    const nextAuthorIndx = currAuthorIndx + 1 === members.length ? 0 : currAuthorIndx + 1;
    setAuthor(members[nextAuthorIndx]);
  };

  const onSubmit = () => {
    if (activeTab === tabs[0] && !message) return;
    if (activeTab === tabs[1] && !filename) return;
    setActiveTab(tabs[0]);
    setMessage('');
    setFilename('');
    setFileMeta('');
    setIsEnterDown(false);
    setIsShiftDown(false);
    setIsCntrlDown(false);

    if (activeTab === tabs[0]) {
      props.onSubmit({
        ...props.editMessage,
        author,
        type: 'text',
        text: message.trim(),
        selected: true,
      });
    } else {
      props.onSubmit({
        ...props.editMessage,
        author,
        type: 'file',
        filename: filename.trim(),
        file_meta: fileMeta.trim(),
        selected: true,
      });
    }
  };

  const onInputChange = (value: string, cb: Function) => {
    if (isEnterDown) {
      if (isShiftDown) {
        if (!value.slice(0, -1)) return;
        cb(value);
      } else {
        onSubmit();
      }
    } else {
      cb(value);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Shift') setIsShiftDown(true);
    else if (e.key === 'Enter') setIsEnterDown(true);
    else if (e.key === 'Control') setIsCntrlDown(true);
    else if ((e.key === '.' || e.key === 'ю') && isCntrlDown) switchAuthour();
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Shift') setIsShiftDown(false);
    else if (e.key === 'Enter') setIsEnterDown(false);
    else if (e.key === 'Control') setIsCntrlDown(false);
  };

  return (
    <div className='chat-input-container'>
      <div className='header'>
        <Nav tabs className='tabs'>
          <NavItem>
            <NavLink
              className={activeTab === tabs[0] ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tabs[0])}
            >
              Text
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === tabs[1] ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tabs[1])}
            >
              File
            </NavLink>
          </NavItem>
        </Nav>
        <div
          className={`message-author`}
          onClick={() => setAuthorSelectorModalOpened(true)}
        >
          {author}
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={tabs[0]}>
          <Input
            placeholder='Write a message...'
            value={message}
            onChange={(e) => onInputChange(e.target.value, setMessage)}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            type='textarea'
            className='text-input shadow-none'
            innerRef={textInputRef}
          />
        </TabPane>
        <TabPane tabId={tabs[1]}>
          <div className='file-input-container'>
            <Input
              placeholder='Filename'
              value={filename}
              onChange={(e) => onInputChange(e.target.value, setFilename)}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              className='file-input filename shadow-none'
              innerRef={fileInputRef}
            />
            <Input
              placeholder='File meta'
              value={fileMeta}
              onChange={(e) => onInputChange(e.target.value, setFileMeta)}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              type='textarea'
              className='file-input filemeta shadow-none'
            />
          </div>
        </TabPane>
      </TabContent>
      {!!props.members.length &&
        <AuthorSelectorModal
          open={authorSelectorModalOpened}
          onClose={() => setAuthorSelectorModalOpened(false)}
          members={members}
          onSelectAuthor={(member: string) => setAuthor(member)}
        />
      }
    </div>
  )
}