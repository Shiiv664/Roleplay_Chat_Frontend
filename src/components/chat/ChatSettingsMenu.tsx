import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import './ChatSettingsMenu.css';

interface ChatSettingsMenuProps {
  onConfigureFormatting: () => void;
  onConfigureSession: () => void;
}

const ChatSettingsMenu: React.FC<ChatSettingsMenuProps> = ({ 
  onConfigureFormatting,
  onConfigureSession 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleConfigureFormatting = () => {
    onConfigureFormatting();
    setIsOpen(false);
  };

  const handleConfigureSession = () => {
    onConfigureSession();
    setIsOpen(false);
  };

  return (
    <div className="chat-settings-menu">
      <button 
        className="menu-trigger"
        onClick={toggleMenu}
        aria-label="Chat settings menu"
      >
        <MoreHorizontal size={20} />
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
              onClick={handleConfigureSession}
            >
              Configure Session
            </button>
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
