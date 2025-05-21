import type { AIModel } from '../../types';
import './AIModelCard.css';

interface AIModelCardProps {
  aiModel: AIModel;
}

const AIModelCard = ({ aiModel }: AIModelCardProps) => {
  const { label, description } = aiModel;

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
    </div>
  );
};

export default AIModelCard;