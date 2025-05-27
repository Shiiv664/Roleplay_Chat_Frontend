import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import './ChatSettingsMenu.css';

interface ChatSettingsMenuProps {
  onConfigureFormatting: () => void;
}

const ChatSettingsMenu: React.FC<ChatSettingsMenuProps> = ({ 
  onConfigureFormatting 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleConfigureFormatting = () => {
    onConfigureFormatting();
    setIsOpen(false);
  };

  return (
    <div className="chat-settings-menu">
      <button 
        className="menu-trigger"
        onClick={toggleMenu}
        aria-label="Chat settings menu"
      >
        <BsThreeDots />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="menu-overlay" 
            onClick={() => setIsOpen(false)}
          />
          <div className="menu-dropdown">
            <button 
              className="menu-item"
              onClick={handleConfigureFormatting}
            >
              Configure Formatting
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatSettingsMenu;
