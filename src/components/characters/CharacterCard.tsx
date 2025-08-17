import { useNavigate } from 'react-router-dom';
import type { Character } from '../../types';
import './CharacterCard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

interface CharacterCardProps {
  character: Character;
  onDelete?: (id: number) => void;
}

const CharacterCard = ({ character, onDelete }: CharacterCardProps) => {
  const navigate = useNavigate();
  
  // Construct full URL for avatar image
  const getAvatarUrl = () => {
    if (character.avatar_url) {
      // If avatar_url exists, prepend API base URL if it's a relative path
      return character.avatar_url.startsWith('http') 
        ? character.avatar_url 
        : `${API_BASE_URL}${character.avatar_url}`;
    }
    
    if (character.avatar_image) {
      // Fallback to avatar_image if avatar_url doesn't exist
      return character.avatar_image.startsWith('http')
        ? character.avatar_image
        : `${API_BASE_URL}${character.avatar_image.startsWith('/') ? '' : '/'}${character.avatar_image}`;
    }
    
    return null;
  };

  const avatarSrc = getAvatarUrl();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(character.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/characters/${character.id}`);
  };

  return (
    <div className="character-card" onClick={handleCardClick}>
      {onDelete && (
        <button 
          className="delete-button" 
          onClick={handleDeleteClick}
          aria-label={`Delete ${character.name}`}
        >
          ×
        </button>
      )}
      
      <div className="character-avatar">
        {avatarSrc ? (
          <img src={avatarSrc} alt={character.name} />
        ) : (
          <div className="avatar-placeholder">
            {character.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="character-info">
        <h3 className="character-name">{character.name}</h3>
        <p className="character-label">{character.label}</p>
      </div>
    </div>
  );
};

export default CharacterCard;