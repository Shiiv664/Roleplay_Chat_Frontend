# Roadmap Phase 2: User Profiles

## Scope
- Add user profiles functionality to the application

## What is a User Profile?
A User Profile represents the user's own character in the roleplay system. It is:
- NOT related to user accounts or authentication
- Similar to a character but represents the user in conversations
- A persona that the user assumes when interacting with other characters

## Features
1. Create a User Profiles page
   - List all user profiles
   - Display basic user information
   - Add button to create new profiles

2. Header Integration
   - Add link in the header to access User Profiles page

## Technical Tasks
- Create UserProfilesPage component
- Implement UserProfileList component
- Develop CreateUserProfileModal component
- Update Header component with User Profiles link
- Add necessary API services for user profile data
- Maintain dark theme throughout new components
- Follow modular component architecture

## Technical Requirements
- React components with TypeScript
- React Router for navigation
- HTTP client for API calls (to http://127.0.0.1:5000)
- Maintain scalable and modular project structure

## Out of Scope
- User authentication/login features
- User profile editing
- User profile deletion
- Advanced user permission settings

## Implementation Steps

### Header Updates
- ✅ Create "User Profiles" navigation link in Header component
- ✅ Update routing configuration

### API Integration
- ✅ Extend API service to support user profiles endpoints
- ✅ Implement GET /api/v1/user_profiles/ for listing
- ✅ Implement POST /api/v1/user_profiles/ for creation

### User Profiles Page
- ✅ Create UserProfilesPage component
- ✅ Implement UserProfileList component
- ✅ Style according to dark theme
- ✅ Connect to API service

### Create User Profile Feature
- ✅ Develop CreateUserProfileModal component
- ✅ Implement form with required fields
- ✅ Add validation
- ✅ Integrate with POST API endpoint
- ✅ Handle form submission and list refresh

### Testing & Integration
- 🚧 Test all new functionality
- ✅ Verify Header navigation
- ✅ Check dark theme consistency
- ✅ Ensure proper component integration

**Status Legend:**
-     Not started
- 🚧 In Progress 
- ✅ Done
- ❌ Aborted