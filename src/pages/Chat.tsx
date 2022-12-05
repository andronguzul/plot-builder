import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import { getAllAuthors, getAllMessages, setSelectedToFalse, validateMessages } from '../utils';
import { Members } from '../components/Members';
import { Translations } from '../components/Translations';
import { Chat } from '../components/Chat/Chat';
import { IChat, ILocalization, IMessage, ITranslation } from '../types';
import { useSearchParams } from 'react-router-dom';
import { CleanButton } from '../components/CleanButton';

export const ChatPage = () => {
  const [, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [canDownload, setCanDownload] = useState(false);
  const [chatName, setChatName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<ITranslation[]>([]);
  const [membersOpen, setMembersOpen] = useState(false);
  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [translationKeys, setTranslationKeys] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();

  const hiddenMessagesFileInput = React.useRef<HTMLInputElement>(null);
  const hiddenTranslationsFileInput = React.useRef<HTMLInputElement>(null);

  const messagesRef = React.useRef<IMessage[]>();
  const membersRef = React.useRef<string[]>();
  const translationsRef = React.useRef<ITranslation[]>();
  const translationKeysRef = React.useRef<string[]>();
  const chatNameRef = React.useRef<string>();
  messagesRef.current = messages;
  membersRef.current = members;
  translationsRef.current = translations;
  translationKeysRef.current = translationKeys;
  chatNameRef.current = chatName;

  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    const savedMembers = localStorage.getItem('members');
    const savedTranslations = localStorage.getItem('translations');
    const savedTranslationKeys = localStorage.getItem('translationKeys');
    const savedChatName = localStorage.getItem('chatName');
    const savedLastUpdated = localStorage.getItem('chatLastUpdated');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedTranslations) setTranslations(JSON.parse(savedTranslations));
    if (savedTranslationKeys) setTranslationKeys(JSON.parse(savedTranslationKeys));
    if (savedChatName) setChatName(JSON.parse(savedChatName));
    if (savedLastUpdated) setLastUpdated(new Date(savedLastUpdated));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSavedItem(messagesRef.current, 'messages');
      updateSavedItem(membersRef.current, 'members');
      updateSavedItem(translationsRef.current, 'translations');
      updateSavedItem(translationKeysRef.current, 'translationKeys');
      updateSavedItem(chatNameRef.current, 'chatName');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateSavedItem = (currentData: unknown, localStorageKey: string) => {
    const localStorageData = localStorage.getItem(localStorageKey);
    if (JSON.stringify(currentData) !== localStorageData) {
      localStorage.setItem(localStorageKey, JSON.stringify(currentData));
      const now = new Date();
      localStorage.setItem('chatLastUpdated', now.toString());
      setLastUpdated(now);
    }
  };


  useEffect(() => {
    setCanDownload(!!chatName && messages.length > 0 && validateMessages(messages));
  }, [messages, chatName]);

  useEffect(() => {
    setTranslationKeys(getAllMessages(messages).filter((v, i, s) => s.indexOf(v) === i));
  }, [messages]);

  const onSaveMembers = (list: string[]) => {
    setMembers(list);
    setMembersOpen(false);
  };

  const onSaveTranslations = (list: ITranslation[]) => {
    setTranslations(list);
    setTranslationsOpen(false);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>, cb: Function) => {
    if (!e.target.files) return;
    const cancel = e.target.files.length !== 1;
    if (cancel) return;
    const fileName = e.target.files[0].name;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      try {
        const data = e.target?.result;
        cb(data, fileName);
      } catch (e) {
        console.log('Invalid file provided', e);
      }
    };
  }

  const onChatImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string, fileName: string) => {
      const parsed: IChat = JSON.parse(data);
      if (!parsed.messages.length || !validateMessages(parsed.messages)) {
        throw new Error();
      }
      setMessages(parsed.messages);
      setMembers(getAllAuthors(parsed.messages));
      setChatName(fileName.split('.')[0]);
    });
  };

  const onTranslationsImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string) => {
      const parsed: ILocalization = JSON.parse(data);
      setTranslations(parsed.translations);
    });
  };

  const download = async (content: any, extenstion: string) => {
    const fileName = chatName;
    const blob = new Blob([content], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + extenstion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDownload = async () => {
    const chat: IChat = {
      membersAmount: members.length,
      messages: setSelectedToFalse(JSON.parse(JSON.stringify(messages))),
    }
    const chatContent = JSON.stringify(chat);
    const translationsContent = JSON.stringify({ translations });
    await download(chatContent, '.json');
    await download(translationsContent, '.json');
  };

  return (
    <div className='chat-page'>
      <Chat
        messages={messages}
        members={members}
        onChangeMessages={(data: IMessage[]) => setMessages(data)}
      />
      <div className='chat-actions-left in-row'>
        <Input
          placeholder='chat-name'
          value={chatName}
          onChange={e => setChatName(e.target.value)}
          className='margined-right'
        />
        <ButtonGroup>
          <Button onClick={() => setMembersOpen(true)}>Members</Button>
          <Button onClick={() => setTranslationsOpen(true)}>Translations</Button>
        </ButtonGroup>
      </div>
      <div className='chat-actions-right in-row'>
        <div className='last-updated'>
          Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'never'}
        </div>
        <ButtonGroup>
          <Button onClick={() => hiddenMessagesFileInput.current?.click()}>Import Messages</Button>
          <Button onClick={() => hiddenTranslationsFileInput.current?.click()}>Import Translations</Button>
          <CleanButton
            onClean={() => {
              setMessages([]);
              setMembers([]);
              setTranslations([]);
              setTranslationKeys([]);
              setCanDownload(false);
              setChatName('');
            }}
          />
          <Button disabled={!canDownload} onClick={onDownload}>Download</Button>
          <Button onClick={() => {
            setSearchParams({
              page: '2',
            });
          }}>Audio</Button>
        </ButtonGroup>
      </div>
      <Members
        members={members}
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        onSave={onSaveMembers}
      />
      <Translations
        translations={translations}
        keys={translationKeys}
        open={translationsOpen}
        onClose={() => setTranslationsOpen(false)}
        onSave={onSaveTranslations}
      />
      <input
        type='file'
        ref={hiddenMessagesFileInput}
        onChange={onChatImport}
        className='hidden'
        accept='.json'
      />
      <input
        type='file'
        ref={hiddenTranslationsFileInput}
        onChange={onTranslationsImport}
        className='hidden'
        accept='.json'
      />
    </div>
  );
}
