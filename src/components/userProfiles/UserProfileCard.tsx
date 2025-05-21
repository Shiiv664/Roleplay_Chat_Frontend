import type { UserProfile } from '../../types';
import './UserProfileCard.css';

interface UserProfileCardProps {
  userProfile: UserProfile;
}

const UserProfileCard = ({ userProfile }: UserProfileCardProps) => {
  const { name, description, avatar_url } = userProfile;
  
  // Default avatar if none is provided
  const avatarSrc = avatar_url || '/default-avatar.png';

  return (
    <div className="user-profile-card">
      <div className="user-profile-avatar">
        <img 
          src={avatarSrc} 
          alt={`${name}'s avatar`} 
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
      </div>
      <div className="user-profile-info">
        <h3 className="user-profile-name">{name}</h3>
        {description && (
          <p className="user-profile-description">
            {description.length > 100
              ? `${description.substring(0, 100)}...`
              : description}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;