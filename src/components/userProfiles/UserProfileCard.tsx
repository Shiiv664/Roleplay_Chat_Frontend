import type { UserProfile } from '../../types';
import './UserProfileCard.css';

// Make sure this matches the API_BASE_URL in api.ts
const API_BASE_URL = 'http://127.0.0.1:5000';

interface UserProfileCardProps {
  userProfile: UserProfile;
}

const UserProfileCard = ({ userProfile }: UserProfileCardProps) => {
  const { name, description, avatar_url, avatar_image } = userProfile;
  
  // Construct full URL for avatar image (same logic as in CharacterCard)
  const getAvatarUrl = () => {
    if (avatar_url) {
      // If avatar_url exists, prepend API base URL if it's a relative path
      return avatar_url.startsWith('http') 
        ? avatar_url 
        : `${API_BASE_URL}${avatar_url}`;
    }
    
    if (avatar_image) {
      // Fallback to avatar_image if avatar_url doesn't exist
      return avatar_image.startsWith('http')
        ? avatar_image
        : `${API_BASE_URL}${avatar_image.startsWith('/') ? '' : '/'}${avatar_image}`;
    }
    
    return null;
  };

  const avatarSrc = getAvatarUrl();
  
  return (
    <div className="user-profile-card">
      <div className="user-profile-avatar">
        {avatarSrc ? (
          <img 
            src={avatarSrc} 
            alt={`${name}'s avatar`}
          />
        ) : (
          <div className="avatar-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
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