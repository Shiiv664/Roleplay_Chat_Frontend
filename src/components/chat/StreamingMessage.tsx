import React from 'react';
import type { FormattingSettings } from '../../types';
import FormattedText from '../common/FormattedText';
import './StreamingMessage.css';

interface StreamingMessageProps {
  content: string;
  formattingSettings?: FormattingSettings | null;
}

const StreamingMessage = ({ content, formattingSettings }: StreamingMessageProps) => {
  return (
    <div className="message-item assistant streaming">
      <div className="message-content">
        <div className="message-text">
          <FormattedText 
            text={content} 
            formattingSettings={formattingSettings}
          />
          <span className="typing-indicator">▊</span>
        </div>
        <div className="message-timestamp">
          streaming...
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;
