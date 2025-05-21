import type { SystemPrompt } from '../../types';
import './SystemPromptCard.css';

interface SystemPromptCardProps {
  systemPrompt: SystemPrompt;
}

const SystemPromptCard = ({ systemPrompt }: SystemPromptCardProps) => {
  const { label, content } = systemPrompt;

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
    </div>
  );
};

export default SystemPromptCard;