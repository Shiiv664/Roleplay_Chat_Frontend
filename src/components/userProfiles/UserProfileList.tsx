import type { UserProfile } from '../../types';
import UserProfileCard from './UserProfileCard';
import './UserProfileList.css';

interface UserProfileListProps {
  userProfiles: UserProfile[];
  onDelete: (id: number) => void;
}

const UserProfileList = ({ userProfiles, onDelete }: UserProfileListProps) => {
  if (userProfiles.length === 0) {
    return (
      <div className="empty-list">
        <p>No user profiles found. Create your first profile to get started!</p>
      </div>
    );
  }

  return (
    <div className="user-profile-list">
      {userProfiles.map((profile) => (
        <UserProfileCard key={profile.id} userProfile={profile} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default UserProfileList;