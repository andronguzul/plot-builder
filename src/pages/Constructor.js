import { useEffect, useState } from 'react';
import { Accordion, Button, ButtonGroup, Input } from 'reactstrap';
import Members from '../components/Constructor/Members';
import MessageEditor from '../components/Constructor/MessageEditor';
import { getAllAuthors, validateMessages } from '../utils.js';

function Constructor() {
  const [messages, setMessages] = useState([{}]);
  const [canDownload, setCanDownload] = useState(true);
  const [openedMessages, setOpenedMessages] = useState(['0']);
  const [chatName, setChatName] = useState('');
  const [members, setMembers] = useState([]);
  const [membersOpen, setMembersOpen] = useState(false);

  useEffect(() => {
    setCanDownload(validateMessages(messages) && chatName);
  }, [messages, chatName]);

  const onToggleAccordion = (targetId) => {
    const opened = [...openedMessages];
    if (opened.includes(targetId)) {
      opened.splice(opened.indexOf(targetId), 1);
    } else {
      opened.push(targetId);
    }
    setOpenedMessages(opened);
  };

  const onSubmit = (message, indx) => {
    const messagesToMutate = [...messages];
    messagesToMutate[indx] = message;
    setMessages(messagesToMutate);
    onToggleAccordion(indx.toString());
  };

  const onMembersModalClose = (list) => {
    if (list) {
      setMembers(list);
    }
    setMembersOpen(false);
  };

  const onImport = (e) => {
    const cancel = e.target.files.length !== 1;
    if (cancel) return;
    const fileName = e.target.files[0].name;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      try {
        const data = e.target.result;
        const parsed = JSON.parse(data);
        if (!parsed.length || !validateMessages(parsed)) {
          throw new Error();
        }
        setMessages(parsed);
        setMembers(getAllAuthors(parsed));
        setChatName(fileName.split('.')[0]);
        console.log(parsed, getAllAuthors(parsed));
      } catch (e) {
        console.log('Invalid file provided', e);
      }
    };
  }

  const onDownload = async () => {
    const fileName = chatName;
    const json = JSON.stringify(messages);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='constructor'>
      <div>
        <Accordion open={openedMessages} toggle={onToggleAccordion} className='messages'>
          {messages.map((message, indx) =>
            <MessageEditor
              members={members}
              key={indx}
              onSubmit={(message) => onSubmit(message, indx)}
              data={message}
              targetId={indx.toString()}
            />
          )}
        </Accordion>
        <Button className='margined-top' onClick={() => {
          const messagesToMutate = [...messages];
          messagesToMutate.push({});
          setMessages(messagesToMutate);
        }}>Add</Button>
      </div>
      <div className='constructor-actions-left in-row'>
        <Input
          placeholder='chat-name'
          value={chatName}
          onChange={e => setChatName(e.target.value)}
          className='chat-name margined-right'
        />
        <Button onClick={() => setMembersOpen(true)}>Members</Button>
      </div>
      <ButtonGroup className='constructor-actions-right'>
        <Input type='file' onChange={onImport}>Import</Input>
        <Button disabled={!canDownload} onClick={onDownload}>Download</Button>
      </ButtonGroup>
      <Members
        members={members}
        open={membersOpen}
        onClose={onMembersModalClose}
      />
    </div>
  );
}

export default Constructor;