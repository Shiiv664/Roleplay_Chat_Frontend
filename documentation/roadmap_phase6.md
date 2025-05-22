# Roadmap Phase 6: Character Detail Page

## Scope
- Create Character detail page with chat sessions list and edit functionality

## Features

### 1. Character Detail Page
- Display character name, label, and description
- Show list of chat sessions for the character
- Order chat sessions by last updated date (newest first)
- Format chat display as "DD/MM/YYYY HHhMM - X msg"

### 2. Chat Sessions List
- Display formatted date and message count for each chat
- Handle empty state when no chats exist
- Proper loading and error states

### 3. Character Edit Navigation
- "Edit Character" button linking to separate edit page
- Avoid modal/popup to prevent accidental data loss
- Maintain navigation flow between pages

### 4. Routing Integration
- Add character detail route with character ID parameter
- Link CharacterCard clicks to detail page
- Ensure proper navigation between character list and detail

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
- ✅ Add chat sessions endpoint to api.ts service
- ✅ Implement GET /api/v1/characters/{id}/chats endpoint call
- ✅ Add character detail and update endpoints

### Character Detail Page
- ✅ Create CharacterDetailPage component
- ✅ Add character data fetching and display
- ✅ Implement chat sessions list with proper formatting
- ✅ Add loading and error state management

### Character Edit Page
- ✅ Create CharacterEditPage component
- ✅ Implement form with character data pre-population
- ✅ Add save functionality and navigation back to detail

### Navigation Integration
- ✅ Add character detail and edit routes to App.tsx
- ✅ Update CharacterCard to link to detail page
- ✅ Ensure proper routing with character ID parameters

### UI Components
- ✅ Style character detail page consistently
- ✅ Format chat session display properly
- ✅ Add responsive layout for different screen sizes

**Status Legend:**
-     Not started
- 🚧 In Progress 
- ✅ Done
- ❌ Aborted