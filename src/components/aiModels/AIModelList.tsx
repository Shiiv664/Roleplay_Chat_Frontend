import type { AIModel } from '../../types';
import AIModelCard from './AIModelCard';
import './AIModelList.css';

interface AIModelListProps {
  aiModels: AIModel[];
}

const AIModelList = ({ aiModels }: AIModelListProps) => {
  if (aiModels.length === 0) {
    return (
      <div className="empty-list">
        <p>No AI models found. Create your first AI model to get started!</p>
      </div>
    );
  }

  return (
    <div className="ai-model-list">
      {aiModels.map((model) => (
        <AIModelCard key={model.id} aiModel={model} />
      ))}
    </div>
  );
};

export default AIModelList;