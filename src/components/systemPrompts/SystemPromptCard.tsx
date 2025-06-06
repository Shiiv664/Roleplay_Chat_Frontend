import type { SystemPrompt } from '../../types';
import './SystemPromptCard.css';

interface SystemPromptCardProps {
  systemPrompt: SystemPrompt;
  onDelete: (id: number) => void;
}

const SystemPromptCard = ({ systemPrompt, onDelete }: SystemPromptCardProps) => {
  const { label, content } = systemPrompt;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(systemPrompt.id);
  };

  return (
    <div className="system-prompt-card">
      <div className="system-prompt-info">
        <h3 className="system-prompt-label">{label}</h3>
        <p className="system-prompt-content">
          {content.length > 200
            ? `${content.substring(0, 200)}...`
            : content}
        </p>
      </div>
      <button 
        className="delete-button" 
        onClick={handleDeleteClick}
        aria-label={`Delete ${label} system prompt`}
      >
        ×
      </button>
    </div>
  );
};

export default SystemPromptCard;