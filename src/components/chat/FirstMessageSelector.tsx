import { useState } from 'react';
import type { FirstMessage } from '../../types';
import './FirstMessageSelector.css';

interface FirstMessageSelectorProps {
  firstMessages: FirstMessage[];
  onSelect: (content: string) => void;
  isLoading?: boolean;
}

const FirstMessageSelector = ({ firstMessages, onSelect, isLoading = false }: FirstMessageSelectorProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (firstMessages.length === 0) {
    return null;
  }

  const currentMessage = firstMessages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => prev === 0 ? firstMessages.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setSelectedIndex((prev) => prev === firstMessages.length - 1 ? 0 : prev + 1);
  };

  const handleValidate = () => {
    if (currentMessage && !isLoading) {
      onSelect(currentMessage.content);
    }
  };

  return (
    <div className="first-message-selector">
      <div className="first-message-header">
        <h3>Choose the character's opening message</h3>
        {firstMessages.length > 1 && (
          <div className="message-counter">
            {selectedIndex + 1} of {firstMessages.length}
          </div>
        )}
      </div>

      <div className="first-message-content">
        {firstMessages.length > 1 && (
          <button 
            className="nav-button nav-button-left"
            onClick={goToPrevious}
            disabled={isLoading}
            aria-label="Previous message"
          >
            ‹
          </button>
        )}

        <div className="message-preview">
          <div className="first-message-text">
            {currentMessage?.content || 'No message content'}
          </div>
        </div>

        {firstMessages.length > 1 && (
          <button 
            className="nav-button nav-button-right"
            onClick={goToNext}
            disabled={isLoading}
            aria-label="Next message"
          >
            ›
          </button>
        )}
      </div>

      <div className="first-message-actions">
        <button 
          className="validate-button"
          onClick={handleValidate}
          disabled={isLoading}
        >
          {isLoading ? 'Starting Chat...' : 'Start Chat with This Message'}
        </button>
      </div>
    </div>
  );
};

export default FirstMessageSelector;
