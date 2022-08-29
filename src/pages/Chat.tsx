import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import { usePapaParse } from 'react-papaparse';
import { getAllAuthors, getAllMessages, validateMessages } from '../utils';
import { Members } from '../components/Members';
import { Translations } from '../components/Translations';
import { Chat } from '../components/Chat/Chat';
import { IMessage, ITranslation } from '../types';

export const ChatPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [canDownload, setCanDownload] = useState(true);
  const [chatName, setChatName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [translations, setTranslations] = useState<ITranslation[]>([]);
  const [membersOpen, setMembersOpen] = useState(false);
  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [translationKeys, setTranslationKeys] = useState<string[]>([]);

  const hiddenMessagesFileInput = React.useRef<HTMLInputElement>(null);
  const hiddenTranslationsFileInput = React.useRef<HTMLInputElement>(null);

  const csvParser = usePapaParse();

  useEffect(() => {
    setCanDownload(!!chatName && messages.length > 0 && validateMessages(messages));
  }, [messages, chatName]);

  useEffect(() => {
    setTranslationKeys(getAllMessages(messages));
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

  const onMessagesImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string, fileName: string) => {
      const parsed = JSON.parse(data);
      if (!parsed.length || !validateMessages(parsed)) {
        throw new Error();
      }
      setMessages(parsed);
      setMembers(getAllAuthors(parsed));
      setChatName(fileName.split('.')[0]);
    });
  };

  const onTranslationsImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e, (data: string) => {
      csvParser.readString(data, {
        worker: true,
        header: true,
        complete: (parsed) => {
          setTranslations(parsed.data as ITranslation[]);
        },
      })
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
    const messagesContent = JSON.stringify(messages);
    const translationsContent = csvParser.jsonToCSV(translations);
    await download(messagesContent, '.json');
    await download(translationsContent, '.csv');
  }

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
          className='chat-name margined-right'
        />
        <ButtonGroup>
          <Button onClick={() => setMembersOpen(true)}>Members</Button>
          <Button onClick={() => setTranslationsOpen(true)}>Translations</Button>
        </ButtonGroup>
      </div>
      <ButtonGroup className='chat-actions-right'>
        <Button onClick={() => hiddenMessagesFileInput.current?.click()}>Import Messages</Button>
        <Button onClick={() => hiddenTranslationsFileInput.current?.click()}>Import Translations</Button>
        <Button disabled={!canDownload} onClick={onDownload}>Download</Button>
      </ButtonGroup>
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
        onChange={onMessagesImport}
        className='hidden'
        accept='.json'
      />
      <input
        type='file'
        ref={hiddenTranslationsFileInput}
        onChange={onTranslationsImport}
        className='hidden'
        accept='.csv'
      />
    </div>
  );
}
