import { useState } from 'react';
import { IMessage, MessageType } from '../../types';
import { Chat } from './Chat';

function ChatWrapperTmp() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      messageData: {
        type: MessageType.Text,
        text: 'How r u doing?',
        author: 'Joe',
      }
    },
    {
      playerMessageData: [
        {
          type: MessageType.Text,
          text: 'Fine bro',
          author: 'Me',
          selected: true,
          fork: [
            {
              messageData: {
                type: MessageType.Text,
                text: 'Glad to hear!',
                author: 'Joe'
              }
            }
          ]
        },
        {
          type: MessageType.Text,
          text: 'Not really',
          author: 'Me',
          selected: false,
          fork: [
            {
              messageData: {
                type: MessageType.Text,
                text: 'My bad :(',
                author: 'Joe'
              }
            }
          ]
        }
      ],
    },
    {
      playerMessageData: [
        {
          type: MessageType.Text,
          text: 'Wbu?',
          author: 'Me',
          selected: true,
        },
      ],
    },
    {
      messageData: {
        type: MessageType.Text,
        text: 'Fine, thanks!',
        author: 'Joe',
      }
    },
  ]);

  return (
    <Chat messages={messages} onChangeMessages={(data: IMessage[]) => setMessages(data)} />
  )
}

export default ChatWrapperTmp;