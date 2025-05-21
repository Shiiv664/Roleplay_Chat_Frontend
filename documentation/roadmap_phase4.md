# Roadmap Phase 4: Delete Functionality

## Scope
- Add delete functionality to all card components with confirmation dialog

## Features

### 1. Delete Button on Cards
- Add delete icon button that appears on hover for all card types
- Apply to: CharacterCard, UserProfileCard, SystemPromptCard, AIModelCard
- Button positioned in top-right corner of card

### 2. Confirmation Dialog
- Show confirmation modal before deletion
- Display item name/label for context
- Cancel and confirm options

### 3. Delete Operations
- Remove item from backend via DELETE API calls
- Refresh list after successful deletion
- Show error message if deletion fails

## Technical Tasks
- Create DeleteConfirmationModal component
- Add delete buttons to all card components
- Extend API services with delete methods
- Add hover state styling for delete buttons
- Handle deletion state management

## Technical Requirements
- React components with TypeScript
- Basic routing (React Router)
- HTTP client for API calls (to http://127.0.0.1:5000)
- Minimal UI framework/CSS
- Maintain dark theme throughout components
- Follow modular component architecture
- Maintain scalable project structure
- Simple styling/layout approach

## Implementation Steps

### API Integration
- Add delete methods to charactersApi, userProfilesApi, systemPromptsApi, aiModelsApi
- Implement DELETE endpoints for each entity type

### Delete Confirmation Modal
- Create reusable DeleteConfirmationModal component
- Add proper styling consistent with existing modals

### Update Card Components
- Add delete button with hover visibility to CharacterCard
- Add delete button with hover visibility to UserProfileCard  
- Add delete button with hover visibility to SystemPromptCard
- Add delete button with hover visibility to AIModelCard

### Page Integration
- Update all list pages to handle deletion
- Refresh data after successful deletion
- Handle error states

**Status Legend:**
-     Not started
- 🚧 In Progress 
- ✅ Done
- ❌ Aborted