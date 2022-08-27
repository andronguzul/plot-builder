import { useState } from 'react';
import { IMessage } from '../../types';
import { Chat } from './Chat';

function ChatWrapperTmp() {
  const [messages, setMessages] = useState<IMessage[]>([
    // {
    //   npcMessageData: {
    //     type: MessageType.Text,
    //     text: 'Hey man',
    //     author: 'Joe',
    //   }
    // },
    // {
    //   npcMessageData: {
    //     type: MessageType.Text,
    //     text: 'How r u doing?',
    //     author: 'Joe',
    //   }
    // },
    // {
    //   playerMessageData: [
    //     {
    //       type: MessageType.Text,
    //       text: 'Fine bro',
    //       author: 'Me',
    //       selected: true,
    //       fork: [
    //         {
    //           npcMessageData: {
    //             type: MessageType.Text,
    //             text: 'Glad to hear!',
    //             author: 'Joe'
    //           }
    //         },
    //         {
    //           playerMessageData: [
    //             {
    //               type: MessageType.Text,
    //               text: 'Thanks man',
    //               author: 'Me',
    //               selected: true,
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       type: MessageType.Text,
    //       text: 'Not really',
    //       author: 'Me',
    //       selected: false,
    //       fork: [
    //         {
    //           npcMessageData: {
    //             type: MessageType.Text,
    //             text: 'My bad :(',
    //             author: 'Joe'
    //           }
    //         }
    //       ]
    //     }
    //   ],
    // },
    // {
    //   playerMessageData: [
    //     {
    //       type: MessageType.Text,
    //       text: 'Wbu?',
    //       author: 'Me',
    //       selected: true,
    //     },
    //   ],
    // },
    // {
    //   npcMessageData: {
    //     type: MessageType.Text,
    //     text: 'Fine, thanks!',
    //     author: 'Joe',
    //   }
    // },
  ]);

  return (
    <Chat messages={messages} onChangeMessages={(data: IMessage[]) => setMessages(data)} />
  )
}

export default ChatWrapperTmp;