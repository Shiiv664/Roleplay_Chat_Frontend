import { useState, useEffect } from 'react';
import { userProfilesApi } from '../services/api';
import type { UserProfile } from '../types';
import './UserProfilesPage.css';
import UserProfileList from '../components/userProfiles/UserProfileList';
import CreateUserProfileModal from '../components/userProfiles/CreateUserProfileModal';

const UserProfilesPage = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUserProfiles = async () => {
    try {
      setLoading(true);
      const profiles = await userProfilesApi.getAll();
      setUserProfiles(profiles);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profiles:', err);
      setError('Failed to load user profiles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const handleCreateUserProfile = async () => {
    setIsCreateModalOpen(false);
    await fetchUserProfiles();
  };

  return (
    <div className="user-profiles-page">
      <div className="container">
        <div className="page-header">
          <h1>User Profiles</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create User Profile
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading user profiles...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <UserProfileList userProfiles={userProfiles} />
        )}

        {isCreateModalOpen && (
          <CreateUserProfileModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onUserProfileCreated={handleCreateUserProfile}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilesPage;