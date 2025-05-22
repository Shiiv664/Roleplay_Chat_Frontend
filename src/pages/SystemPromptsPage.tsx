import { useState, useEffect } from 'react';
import { systemPromptsApi } from '../services/api';
import type { SystemPrompt } from '../types';
import './SystemPromptsPage.css';
import SystemPromptList from '../components/systemPrompts/SystemPromptList';
import CreateSystemPromptModal from '../components/systemPrompts/CreateSystemPromptModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const SystemPromptsPage = () => {
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [systemPromptToDelete, setSystemPromptToDelete] = useState<SystemPrompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSystemPrompts = async () => {
    try {
      setLoading(true);
      const prompts = await systemPromptsApi.getAll();
      setSystemPrompts(prompts);
      setError(null);
    } catch (err) {
      console.error('Error fetching system prompts:', err);
      setError('Failed to load system prompts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemPrompts();
  }, []);

  const handleCreateSystemPrompt = async () => {
    setIsCreateModalOpen(false);
    await fetchSystemPrompts();
  };

  const handleDeleteClick = (id: number) => {
    const promptToDelete = systemPrompts.find(prompt => prompt.id === id);
    if (promptToDelete) {
      setSystemPromptToDelete(promptToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!systemPromptToDelete) return;

    try {
      setIsDeleting(true);
      await systemPromptsApi.delete(systemPromptToDelete.id);
      await fetchSystemPrompts();
      setIsDeleteModalOpen(false);
      setSystemPromptToDelete(null);
    } catch (err) {
      console.error('Error deleting system prompt:', err);
      setError('Failed to delete system prompt. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSystemPromptToDelete(null);
  };

  return (
    <div className="system-prompts-page">
      <div className="container">
        <div className="page-header">
          <h1>System Prompts</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create System Prompt
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading system prompts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <SystemPromptList systemPrompts={systemPrompts} onDelete={handleDeleteClick} />
        )}

        {isCreateModalOpen && (
          <CreateSystemPromptModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSystemPromptCreated={handleCreateSystemPrompt}
          />
        )}

        {isDeleteModalOpen && systemPromptToDelete && (
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={systemPromptToDelete.label}
            itemType="system prompt"
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default SystemPromptsPage;