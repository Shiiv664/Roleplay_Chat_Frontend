import { UserProfile } from '../../types';
import UserProfileCard from './UserProfileCard';
import './UserProfileList.css';

interface UserProfileListProps {
  userProfiles: UserProfile[];
}

const UserProfileList = ({ userProfiles }: UserProfileListProps) => {
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
        <UserProfileCard key={profile.id} userProfile={profile} />
      ))}
    </div>
  );
};

export default UserProfileList;