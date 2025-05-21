import { useState } from 'react';
import { systemPromptsApi } from '../../services/api';
import type { CreateSystemPromptRequest } from '../../types';
import './CreateSystemPromptModal.css';

interface CreateSystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSystemPromptCreated: () => void;
}

const CreateSystemPromptModal = ({
  isOpen,
  onClose,
  onSystemPromptCreated
}: CreateSystemPromptModalProps) => {
  const [formData, setFormData] = useState<CreateSystemPromptRequest>({
    label: '',
    content: ''
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
    if (!formData.label.trim() || !formData.content.trim()) {
      setError('Label and Content are required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await systemPromptsApi.create(formData);
      
      onSystemPromptCreated();
    } catch (err: any) {
      console.error('Error creating system prompt:', err);
      setError(err.response?.data?.error?.message || 'Failed to create system prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create System Prompt</h2>
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
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
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
              {isSubmitting ? 'Creating...' : 'Create System Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSystemPromptModal;