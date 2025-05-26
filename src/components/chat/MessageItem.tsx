import { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import type { Message, FormattingSettings } from '../../types';
import FormattedText from '../common/FormattedText';
import './MessageItem.css';

interface MessageItemProps {
  message: Message;
  formattingSettings?: FormattingSettings | null;
  onDelete?: (messageId: number) => void;
}

const MessageItem = ({ message, formattingSettings, onDelete }: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  return (
    <div 
      className={`message-item ${message.role}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
    >
      <div className="message-content">
        {onDelete && (
          <div 
            style={{
              position: 'absolute',
              top: '8px',
              right: message.role === 'user' ? '8px' : 'auto',
              left: message.role === 'assistant' ? '8px' : 'auto',
              zIndex: 999,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: isHovered ? 'auto' : 'none'
            }}
          >
            <button
              onClick={handleDelete}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Delete this message and all subsequent messages"
              style={{
                background: 'transparent',
                border: 'none',
                borderRadius: '4px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#888',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.color = '#ff4444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#888';
              }}
            >
              <MdDeleteOutline 
                size={16} 
                className="delete-icon-svg"
              />
            </button>
            {showTooltip && (
              <div 
                style={{
                  position: 'absolute',
                  top: '-45px',
                  right: message.role === 'user' ? '0' : 'auto',
                  left: message.role === 'assistant' ? '0' : 'auto',
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
              >
                Delete this message and all subsequent messages
              </div>
            )}
          </div>
        )}
        <div className="message-text">
          <FormattedText 
            text={message.content} 
            formattingSettings={formattingSettings}
          />
        </div>
        <div className="message-timestamp">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
