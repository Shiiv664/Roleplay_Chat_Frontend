import { useState, useEffect } from 'react';
import { aiModelsApi } from '../services/api';
import type { AIModel } from '../types';
import './AIModelsPage.css';
import AIModelList from '../components/aiModels/AIModelList';
import CreateAIModelModal from '../components/aiModels/CreateAIModelModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const AIModelsPage = () => {
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [aiModelToDelete, setAIModelToDelete] = useState<AIModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAIModels = async () => {
    try {
      setLoading(true);
      const models = await aiModelsApi.getAll();
      setAIModels(models);
      setError(null);
    } catch (err) {
      console.error('Error fetching AI models:', err);
      setError('Failed to load AI models. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIModels();
  }, []);

  const handleCreateAIModel = async () => {
    setIsCreateModalOpen(false);
    await fetchAIModels();
  };

  const handleDeleteClick = (id: number) => {
    const modelToDelete = aiModels.find(model => model.id === id);
    if (modelToDelete) {
      setAIModelToDelete(modelToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!aiModelToDelete) return;

    try {
      setIsDeleting(true);
      await aiModelsApi.delete(aiModelToDelete.id);
      await fetchAIModels();
      setIsDeleteModalOpen(false);
      setAIModelToDelete(null);
    } catch (err) {
      console.error('Error deleting AI model:', err);
      setError('Failed to delete AI model. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAIModelToDelete(null);
  };

  return (
    <div className="ai-models-page">
      <div className="container">
        <div className="page-header">
          <h1>AI Models</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create AI Model
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading AI models...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <AIModelList aiModels={aiModels} onDelete={handleDeleteClick} />
        )}

        {isCreateModalOpen && (
          <CreateAIModelModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onAIModelCreated={handleCreateAIModel}
          />
        )}

        {isDeleteModalOpen && aiModelToDelete && (
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={aiModelToDelete.label}
            itemType="AI model"
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default AIModelsPage;