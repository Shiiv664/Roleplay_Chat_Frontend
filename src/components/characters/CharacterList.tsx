import type { Character } from '../../types';
import CharacterCard from './CharacterCard';
import './CharacterList.css';

interface CharacterListProps {
  characters: Character[];
  onDelete?: (character: Character) => void;
}

const CharacterList = ({ characters, onDelete }: CharacterListProps) => {
  // Safety check to ensure characters is an array
  if (!Array.isArray(characters)) {
    console.error('CharacterList received non-array characters:', characters);
    return (
      <div className="character-list-empty">
        <p>Error: Invalid character data received.</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="character-list-empty">
        <p>No characters found. Create your first character to get started!</p>
      </div>
    );
  }

  return (
    <div className="character-list">
      {characters.map((character) => (
        <CharacterCard 
          key={character.id} 
          character={character} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CharacterList;