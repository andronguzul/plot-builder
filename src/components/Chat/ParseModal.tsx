import { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IMessage, MessageType } from '../../types';

export interface ParseModalProps {
  onClose: Function;
  open: boolean;
  members: string[];
}

export const ParseModal = (props: ParseModalProps) => {
  const [data, setData] = useState('');

  const onSubmit = () => {
    const members = ['Me', ...props.members].map(x => `${x}:`);
    const dividingRegex = new RegExp(`(${members.join('|')})`, 'g');
    const divided = data.split(dividingRegex).filter(x => x).map(x => x.trim());

    let currentAuthor = '';
    const messages: IMessage[] = [];
    for (const item of divided) {
      if (dividingRegex.test(item)) {
        currentAuthor = item.slice(0, -1);
      } else if (!currentAuthor) {
        continue;
      } else {
        const authorMessages = item.split('\n');
        for (const authorMessage of authorMessages) {
          if (currentAuthor === 'Me') {
            messages.push({
              playerMessageData: [{
                author: currentAuthor,
                type: MessageType.Text,
                text: authorMessage,
                selected: false,
              }],
            });
          } else {
            messages.push({
              npcMessageData: {
                author: currentAuthor,
                type: MessageType.Text,
                text: authorMessage,
              },
            });
          }
        }
      }
    }
    props.onClose(messages);
  };

  return (
    <Modal
      toggle={() => props.onClose()}
      isOpen={props.open}
      className='member-selector-modal'
    >
      <ModalHeader toggle={() => props.onClose()}>
        Parse raw
      </ModalHeader>
      <ModalBody>
        <Input
          type='textarea'
          value={data}
          onChange={(e) => setData(e.target.value)}
          className='parse-modal-input'
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button onClick={() => onSubmit()}>Submit</Button>
      </ModalFooter>
    </Modal>
  );
}