import { useState } from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import type { Message, FormattingSettings } from '../../types';
import FormattedText from '../common/FormattedText';
import './MessageItem.css';

interface MessageItemProps {
  message: Message;
  formattingSettings?: FormattingSettings | null;
  onDelete?: (messageId: number) => void;
  onEdit?: (messageId: number, newContent: string) => Promise<void>;
}

const MessageItem = ({ message, formattingSettings, onDelete, onEdit }: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  // Calculate textarea height based on content
  const calculateTextareaHeight = () => {
    const lineHeight = 1.5;
    const fontSize = 16; // 1rem = 16px typically
    const padding = 32; // 1rem top + 1rem bottom = 32px
    const lines = editContent.split('\n').length;
    const minLines = Math.max(3, lines); // At least 3 lines, or more if content is longer
    return Math.max(100, minLines * fontSize * lineHeight + padding);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!onEdit || editContent.trim() === '') return;
    
    setIsLoading(true);
    try {
      await onEdit(message.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setIsLoading(false);
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
        {(onDelete || onEdit) && !isEditing && (
          <div 
            style={{
              position: 'absolute',
              top: '8px',
              right: message.role === 'user' ? '8px' : 'auto',
              left: message.role === 'assistant' ? '8px' : 'auto',
              zIndex: 999,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
              display: 'flex',
              gap: '4px'
            }}
          >
            {onEdit && (
              <button
                onClick={handleEdit}
                aria-label="Edit this message"
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
                  e.currentTarget.style.color = '#4444ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#888';
                }}
              >
                <Edit3 
                  size={16} 
                />
              </button>
            )}
            
            {onDelete && (
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
                <Trash2 
                  size={16} 
                />
              </button>
            )}
            
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
          {isEditing ? (
            <div className="edit-mode">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: `${calculateTextareaHeight()}px`,
                  minHeight: '100px',
                  minWidth: '600px',
                  padding: '1rem 1.25rem',
                  border: '1px solid #ccc',
                  borderRadius: '1rem',
                  resize: 'both',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: '1.5',
                  backgroundColor: '#3a3a3a',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
              <div 
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading || editContent.trim() === ''}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: editContent.trim() === '' ? '#ccc' : '#007bff',
                    color: 'white',
                    cursor: editContent.trim() === '' ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <FormattedText 
              text={message.content} 
              formattingSettings={formattingSettings}
            />
          )}
        </div>
        <div className="message-timestamp">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
