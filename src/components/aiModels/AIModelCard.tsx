import type { AIModel } from '../../types';
import './AIModelCard.css';

interface AIModelCardProps {
  aiModel: AIModel;
  onDelete: (id: number) => void;
}

const AIModelCard = ({ aiModel, onDelete }: AIModelCardProps) => {
  const { label, description } = aiModel;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(aiModel.id);
  };

  return (
    <div className="ai-model-card">
      <div className="ai-model-info">
        <h3 className="ai-model-label">{label}</h3>
        {description && (
          <p className="ai-model-description">
            {description.length > 150
              ? `${description.substring(0, 150)}...`
              : description}
          </p>
        )}
      </div>
      <button 
        className="delete-button" 
        onClick={handleDeleteClick}
        aria-label={`Delete ${label} AI model`}
      >
        ×
      </button>
    </div>
  );
};

export default AIModelCard;