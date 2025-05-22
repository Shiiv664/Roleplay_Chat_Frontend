import { useState, useEffect } from 'react';
import { charactersApi } from '../services/api';
import type { Character } from '../types';
import CharacterList from '../components/characters/CharacterList';
import CreateCharacterModal from '../components/characters/CreateCharacterModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import './CharactersPage.css';

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (id: number) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      setCharacterToDelete(character);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!characterToDelete) return;

    try {
      setIsDeleting(true);
      await charactersApi.delete(characterToDelete.id);
      setShowDeleteModal(false);
      setCharacterToDelete(null);
      fetchCharacters();
    } catch (err) {
      console.error('Error deleting character:', err);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCharacterToDelete(null);
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
        
        <CharacterList characters={characters} onDelete={handleDeleteClick} />
        
        {showCreateModal && (
          <CreateCharacterModal
            onClose={() => setShowCreateModal(false)}
            onCharacterCreated={handleCharacterCreated}
          />
        )}

        {showDeleteModal && characterToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={characterToDelete.name}
            itemType="Character"
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default CharactersPage;