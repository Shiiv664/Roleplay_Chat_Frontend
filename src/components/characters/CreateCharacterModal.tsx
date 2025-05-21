import { useState } from 'react';
import { charactersApi } from '../../services/api';
import type { CreateCharacterRequest } from '../../types';
import './CreateCharacterModal.css';

interface CreateCharacterModalProps {
  onClose: () => void;
  onCharacterCreated: () => void;
}

const CreateCharacterModal = ({ onClose, onCharacterCreated }: CreateCharacterModalProps) => {
  const [formData, setFormData] = useState<CreateCharacterRequest>({
    label: '',
    name: '',
    description: '',
    avatar_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim() || !formData.name.trim()) {
      setError('Label and Name are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...formData,
        description: formData.description?.trim() || undefined,
        avatar_image: formData.avatar_image?.trim() || undefined,
      };
      
      await charactersApi.create(submitData);
      onCharacterCreated();
    } catch (err) {
      setError('Failed to create character');
      console.error('Error creating character:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Character</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="character-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="label">Label *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              placeholder="e.g., Protagonist, Villain, NPC"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Character's name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Character's background and personality..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="avatar_image">Avatar Image URL</label>
            <input
              type="url"
              id="avatar_image"
              name="avatar_image"
              value={formData.avatar_image}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterModal;