/** @format */

import { useEffect, useState } from 'react';
import { getIO, initIO } from './socketIo';

const useChatMessageWebsocket = () => {
  useEffect(() => {
    initIO();
  }, []);
  useEffect(() => {
    const io = getIO();
    io.on('chat-message', onChatMessageRecived);
  }, []);
  const [receivedMessage, setReceivedMessage] = useState<any>();
  const onChatMessageRecived = (message: any) => {
    setReceivedMessage(message);
  };
  return [receivedMessage];
};

export default useChatMessageWebsocket;

