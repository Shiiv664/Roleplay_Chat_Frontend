import type { SystemPrompt } from '../../types';
import SystemPromptCard from './SystemPromptCard';
import './SystemPromptList.css';

interface SystemPromptListProps {
  systemPrompts: SystemPrompt[];
}

const SystemPromptList = ({ systemPrompts }: SystemPromptListProps) => {
  if (systemPrompts.length === 0) {
    return (
      <div className="empty-list">
        <p>No system prompts found. Create your first system prompt to get started!</p>
      </div>
    );
  }

  return (
    <div className="system-prompt-list">
      {systemPrompts.map((prompt) => (
        <SystemPromptCard key={prompt.id} systemPrompt={prompt} />
      ))}
    </div>
  );
};

export default SystemPromptList;