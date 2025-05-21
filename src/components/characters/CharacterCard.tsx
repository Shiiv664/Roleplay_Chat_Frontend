import type { Character } from '../../types';
import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard = ({ character }: CharacterCardProps) => {
  return (
    <div className="character-card">
      <div className="character-avatar">
        {character.avatar_image ? (
          <img src={character.avatar_image} alt={character.name} />
        ) : (
          <div className="avatar-placeholder">
            {character.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="character-info">
        <h3 className="character-name">{character.name}</h3>
        <p className="character-label">{character.label}</p>
        {character.description && (
          <p className="character-description">{character.description}</p>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;