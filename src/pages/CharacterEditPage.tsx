import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { charactersApi } from '../services/api';
import type { Character, CreateCharacterRequest, FirstMessage } from '../types';
import FileUpload from '../components/common/FileUpload';
import './CharacterEditPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

const CharacterEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCharacterRequest>({
    label: '',
    name: '',
    description: '',
    first_messages: [],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchCharacter = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const characterId = parseInt(id, 10);
      const characterResponse = await charactersApi.getById(characterId);
      
      setCharacter(characterResponse);
      setFormData({
        label: characterResponse.label,
        name: characterResponse.name,
        description: characterResponse.description || '',
        first_messages: characterResponse.first_messages || [],
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching character:', err);
      setError('Failed to load character. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!character) return;

    try {
      setSaving(true);
      setError(null);

      await charactersApi.update(character.id, formData, avatarFile || undefined);
      navigate(`/characters/${character.id}`);
    } catch (err) {
      console.error('Error updating character:', err);
      setError('Failed to update character. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFirstMessage = () => {
    const newMessage: FirstMessage = {
      id: Date.now(), // Temporary ID
      content: '',
      order: formData.first_messages?.length || 0,
    };
    
    setFormData(prev => ({
      ...prev,
      first_messages: [...(prev.first_messages || []), newMessage],
    }));
  };

  const handleUpdateFirstMessage = (id: number, content: string) => {
    setFormData(prev => ({
      ...prev,
      first_messages: prev.first_messages?.map(msg => 
        msg.id === id ? { ...msg, content } : msg
      ) || [],
    }));
  };

  const handleDeleteFirstMessage = (id: number) => {
    setFormData(prev => ({
      ...prev,
      first_messages: prev.first_messages?.filter(msg => msg.id !== id) || [],
    }));
  };

  const handleMoveFirstMessage = (id: number, direction: 'up' | 'down') => {
    const messages = formData.first_messages || [];
    const index = messages.findIndex(msg => msg.id === id);
    if (index === -1) return;

    const newMessages = [...messages];
    if (direction === 'up' && index > 0) {
      [newMessages[index], newMessages[index - 1]] = [newMessages[index - 1], newMessages[index]];
    } else if (direction === 'down' && index < newMessages.length - 1) {
      [newMessages[index], newMessages[index + 1]] = [newMessages[index + 1], newMessages[index]];
    }

    // Update order values
    newMessages.forEach((msg, idx) => {
      msg.order = idx;
    });

    setFormData(prev => ({
      ...prev,
      first_messages: newMessages,
    }));
  };

  const getAvatarUrl = (character: Character) => {
    if (character.avatar_url) {
      return character.avatar_url.startsWith('http') 
        ? character.avatar_url 
        : `${API_BASE_URL}${character.avatar_url}`;
    }
    
    if (character.avatar_image) {
      return character.avatar_image.startsWith('http')
        ? character.avatar_image
        : `${API_BASE_URL}${character.avatar_image.startsWith('/') ? '' : '/'}${character.avatar_image}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="character-edit-page">
        <div className="container">
          <div className="loading">Loading character...</div>
        </div>
      </div>
    );
  }

  if (error && !character) {
    return (
      <div className="character-edit-page">
        <div className="container">
          <div className="error">{error}</div>
          <Link to="/characters" className="btn btn-secondary">
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="character-edit-page">
        <div className="container">
          <div className="error">Character not found</div>
          <Link to="/characters" className="btn btn-secondary">
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  const avatarSrc = getAvatarUrl(character);

  return (
    <div className="character-edit-page">
      <div className="container">
        <div className="page-header">
          <Link to={`/characters/${character.id}`} className="back-link">
            ← Back to Character
          </Link>
          <h1>Edit Character</h1>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="character-form">
          <div className="form-group">
            <label htmlFor="label">Label *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              required
              placeholder="Enter character label"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter character name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter character description (optional)"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Avatar Image</label>
            {avatarSrc && (
              <div className="current-avatar">
                <img src={avatarSrc} alt="Current avatar" />
                <span>Current Avatar</span>
              </div>
            )}
            <FileUpload
              onFileSelect={handleAvatarChange}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
            />
          </div>

          <div className="form-group">
            <label>First Messages</label>
            <div className="first-messages-section">
              <p className="help-text">
                Configure opening messages that this character can send when starting a new chat.
              </p>
              
              {formData.first_messages && formData.first_messages.length > 0 ? (
                <div className="first-messages-list">
                  {formData.first_messages.map((message, index) => (
                    <div key={message.id} className="first-message-item">
                      <div className="message-header">
                        <span className="message-number">Message {index + 1}</span>
                        <div className="message-actions">
                          <button
                            type="button"
                            onClick={() => handleMoveFirstMessage(message.id, 'up')}
                            disabled={index === 0}
                            className="btn-move"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFirstMessage(message.id, 'down')}
                            disabled={index === formData.first_messages!.length - 1}
                            className="btn-move"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFirstMessage(message.id)}
                            className="btn-delete"
                            title="Delete message"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={message.content}
                        onChange={(e) => handleUpdateFirstMessage(message.id, e.target.value)}
                        placeholder="Enter the first message content..."
                        rows={3}
                        className="first-message-content"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-messages">
                  <p>No first messages configured.</p>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleAddFirstMessage}
                className="btn btn-secondary add-message-btn"
              >
                + Add First Message
              </button>
            </div>
          </div>

          <div className="form-actions">
            <Link 
              to={`/characters/${character.id}`} 
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterEditPage;