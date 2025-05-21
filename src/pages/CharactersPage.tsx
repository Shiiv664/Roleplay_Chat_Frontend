import { useState, useEffect } from 'react';
import { charactersApi } from '../services/api';
import type { Character } from '../types';
import CharacterList from '../components/characters/CharacterList';
import CreateCharacterModal from '../components/characters/CreateCharacterModal';
import './CharactersPage.css';

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await charactersApi.getAll();
      console.log('API response:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCharacters(data);
      } else {
        console.error('API returned non-array data:', data);
        setCharacters([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching characters:', err);
      setCharacters([]); // Ensure characters is always an array
      setError('Failed to load characters. Is the backend API running at http://127.0.0.1:5000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCharacterCreated = () => {
    setShowCreateModal(false);
    fetchCharacters();
  };

  if (loading) {
    return (
      <div className="characters-page">
        <div className="container">
          <div className="loading">Loading characters...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="characters-page">
        <div className="container">
          <div className="error">{error}</div>
          <button className="btn btn-primary" onClick={fetchCharacters}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="characters-page">
      <div className="container">
        <div className="page-header">
          <h2>Characters</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Character
          </button>
        </div>
        
        <CharacterList characters={characters} />
        
        {showCreateModal && (
          <CreateCharacterModal
            onClose={() => setShowCreateModal(false)}
            onCharacterCreated={handleCharacterCreated}
          />
        )}
      </div>
    </div>
  );
};

export default CharactersPage;