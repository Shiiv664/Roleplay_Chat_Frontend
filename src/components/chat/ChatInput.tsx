import { useState, useRef, KeyboardEvent } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onCancelMessage: () => void;
  disabled: boolean;
  isStreaming: boolean;
}

const ChatInput = ({ onSendMessage, onCancelMessage, disabled, isStreaming }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="chat-input">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "AI is responding..." : "Type your message... (Enter to send, Shift+Enter for new line)"}
            disabled={disabled}
            className="message-textarea"
            rows={1}
          />
          
          <div className="input-actions">
            {isStreaming ? (
              <button
                type="button"
                onClick={onCancelMessage}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="btn btn-send"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
