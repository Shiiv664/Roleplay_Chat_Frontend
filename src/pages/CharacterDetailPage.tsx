import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { charactersApi, chatApi } from '../services/api';
import type { Character, ChatSession } from '../types';
import './CharacterDetailPage.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<number | null>(null);
  const [chatToDelete, setChatToDelete] = useState<ChatSession | null>(null);

  const fetchCharacterData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const characterId = parseInt(id, 10);
      const [characterResponse, chatsResponse] = await Promise.all([
        charactersApi.getById(characterId),
        charactersApi.getChats(characterId),
      ]);

      setCharacter(characterResponse);
      setChatSessions(chatsResponse);
      setError(null);
    } catch (err) {
      console.error('Error fetching character data:', err);
      setError('Failed to load character details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterData();
  }, [id]);

  const handleNewChat = async () => {
    if (!character) return;

    try {
      setCreatingChat(true);

      // Create new chat session - now only requires character_id
      const chatSession = await chatApi.createChatSession({
        character_id: character.id,
      });

      // Navigate to the chat page
      navigate(`/chat/${chatSession.id}`);
    } catch (err) {
      console.error('Error creating chat session:', err);
      setError('Failed to create new chat session. Please try again.');
    } finally {
      setCreatingChat(false);
    }
  };

  const handleDeleteChat = (chatSession: ChatSession, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation to chat
    event.stopPropagation();
    setChatToDelete(chatSession);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      setDeletingChatId(chatToDelete.id);
      await chatApi.deleteChatSession(chatToDelete.id);
      
      // Remove the deleted chat from the list
      setChatSessions(prev => prev.filter(chat => chat.id !== chatToDelete.id));
      setChatToDelete(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting chat session:', err);
      setError('Failed to delete chat session. Please try again.');
    } finally {
      setDeletingChatId(null);
    }
  };

  const cancelDeleteChat = () => {
    setChatToDelete(null);
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

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}h${minutes}`;
  };

  if (loading) {
    return (
      <div className="character-detail-page">
        <div className="container">
          <div className="loading">Loading character details...</div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="character-detail-page">
        <div className="container">
          <div className="error">{error || 'Character not found'}</div>
          <Link to="/characters" className="btn btn-secondary">
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  const avatarSrc = getAvatarUrl(character);
  const sortedChats = [...chatSessions].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="character-detail-page">
      <div className="container">
        <div className="character-header">
          <Link to="/characters" className="back-link">
            ← Back to Characters
          </Link>
          
          <div className="character-info">
            <div className="character-avatar">
              {avatarSrc ? (
                <img 
                  src={avatarSrc} 
                  alt={`${character.name}'s avatar`}
                />
              ) : (
                <div className="avatar-placeholder">
                  {character.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="character-details">
              <h1 className="character-name">{character.name}</h1>
              <p className="character-label">{character.label}</p>
              {character.description && (
                <p className="character-description">{character.description}</p>
              )}
            </div>
          </div>
          
          <div className="character-actions">
            <button 
              onClick={handleNewChat}
              disabled={creatingChat}
              className="btn btn-primary"
              style={{ marginRight: '10px' }}
            >
              {creatingChat ? 'Creating...' : 'Start New Chat'}
            </button>
            <Link 
              to={`/characters/${character.id}/edit`} 
              className="btn btn-secondary"
            >
              Edit Character
            </Link>
          </div>
        </div>

        <div className="chat-sessions-section">
          <h2>Chat Sessions</h2>
          
          {sortedChats.length === 0 ? (
            <div className="empty-chats">
              <p>No chat sessions found for this character.</p>
              <p>Start a conversation to see chat history here.</p>
            </div>
          ) : (
            <div className="chat-sessions-list">
              {sortedChats.map((chat) => (
                <div key={chat.id} className="chat-session-item">
                  <Link 
                    to={`/chat/${chat.id}`}
                    className="chat-session-link"
                  >
                    <span className="chat-date">
                      {formatChatDate(chat.updated_at)}
                    </span>
                    <span className="chat-message-count">
                      {chat.message_count} msg
                    </span>
                  </Link>
                  <button
                    onClick={(e) => handleDeleteChat(chat, e)}
                    disabled={deletingChatId === chat.id}
                    className="btn-delete"
                    title="Delete chat session"
                  >
                    {deletingChatId === chat.id ? '...' : '🗑️'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Delete Confirmation Dialog */}
        {chatToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete Chat Session</h3>
              <p>
                Are you sure you want to delete this chat session from{' '}
                <strong>{formatChatDate(chatToDelete.updated_at)}</strong>?
              </p>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  onClick={cancelDeleteChat}
                  className="btn btn-secondary"
                  disabled={deletingChatId !== null}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteChat}
                  className="btn btn-danger"
                  disabled={deletingChatId !== null}
                >
                  {deletingChatId !== null ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetailPage;