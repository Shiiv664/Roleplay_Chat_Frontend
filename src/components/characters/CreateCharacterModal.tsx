import { useState } from 'react';
import { charactersApi } from '../../services/api';
import type { CreateCharacterRequest, FirstMessage } from '../../types';
import FileUpload from '../common/FileUpload';
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
    first_messages: [],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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
        avatar_image: avatarFile ? undefined : formData.avatar_image?.trim() || undefined,
      };
      
      await charactersApi.create(submitData, avatarFile || undefined);
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

  const handleAddFirstMessage = () => {
    const newMessage: FirstMessage = {
      id: Date.now(),
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
            <label>Avatar Image</label>
            <FileUpload
              onFileSelect={setAvatarFile}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              maxSize={5 * 1024 * 1024} // 5MB
              preview={true}
              disabled={loading}
            />
            <div className="form-hint">
              Upload an image file or leave empty for default avatar
            </div>
          </div>
          
          <div className="form-group">
            <label>First Messages (Optional)</label>
            <div className="first-messages-section">
              {formData.first_messages && formData.first_messages.length > 0 ? (
                <div className="first-messages-list">
                  {formData.first_messages.map((message, index) => (
                    <div key={message.id} className="first-message-item">
                      <div className="message-header">
                        <span className="message-number">Message {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFirstMessage(message.id)}
                          className="btn-delete"
                          title="Delete message"
                        >
                          ×
                        </button>
                      </div>
                      <textarea
                        value={message.content}
                        onChange={(e) => handleUpdateFirstMessage(message.id, e.target.value)}
                        placeholder="Enter the first message content..."
                        rows={2}
                        className="first-message-content"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              
              <button
                type="button"
                onClick={handleAddFirstMessage}
                className="btn btn-secondary add-message-btn"
              >
                + Add First Message
              </button>
              <div className="form-hint">
                Configure opening messages that this character can send when starting a chat
              </div>
            </div>
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