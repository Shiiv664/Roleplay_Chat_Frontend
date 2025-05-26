import { useEffect, useRef } from 'react';
import type { Message } from '../../types';
import MessageItem from './MessageItem';
import StreamingMessage from './StreamingMessage';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
  streamingMessage: string;
  isStreaming: boolean;
  onDeleteMessage?: (messageId: number) => void;
}

const MessageList = ({ messages, streamingMessage, isStreaming, onDeleteMessage }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.length === 0 && !isStreaming && (
          <div className="empty-chat">
            <p>Start a conversation with this character!</p>
            <p>Type a message below to begin.</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            onDelete={onDeleteMessage}
          />
        ))}

        {isStreaming && streamingMessage && (
          <StreamingMessage content={streamingMessage} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
