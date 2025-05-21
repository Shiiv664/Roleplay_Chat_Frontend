import { useState } from 'react';
import { userProfilesApi } from '../../services/api';
import { CreateUserProfileRequest } from '../../types';
import FileUpload from '../common/FileUpload';
import './CreateUserProfileModal.css';

interface CreateUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserProfileCreated: () => void;
}

const CreateUserProfileModal = ({
  isOpen,
  onClose,
  onUserProfileCreated
}: CreateUserProfileModalProps) => {
  const [formData, setFormData] = useState<CreateUserProfileRequest>({
    label: '',
    name: '',
    description: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelected = (file: File) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.label.trim() || !formData.name.trim()) {
      setError('Label and Name are required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await userProfilesApi.create(formData, avatarFile || undefined);
      
      onUserProfileCreated();
    } catch (err: any) {
      console.error('Error creating user profile:', err);
      setError(err.response?.data?.error?.message || 'Failed to create user profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create User Profile</h2>
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
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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

          <div className="form-group">
            <label>Avatar Image</label>
            <FileUpload onFileSelected={handleFileSelected} />
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
              {isSubmitting ? 'Creating...' : 'Create User Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserProfileModal;