import { useState } from 'react';
import { aiModelsApi } from '../../services/api';
import type { CreateAIModelRequest } from '../../types';
import './CreateAIModelModal.css';

interface CreateAIModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAIModelCreated: () => void;
}

const CreateAIModelModal = ({
  isOpen,
  onClose,
  onAIModelCreated
}: CreateAIModelModalProps) => {
  const [formData, setFormData] = useState<CreateAIModelRequest>({
    label: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.label.trim()) {
      setError('Label is a required field');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await aiModelsApi.create(formData);
      
      onAIModelCreated();
    } catch (err: any) {
      console.error('Error creating AI model:', err);
      setError(err.response?.data?.error?.message || 'Failed to create AI model. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create AI Model</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="label">Label (Unique Identifier) *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
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
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create AI Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAIModelModal;