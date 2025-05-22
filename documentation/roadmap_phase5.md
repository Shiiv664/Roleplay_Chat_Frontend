# Roadmap Phase 5: Application Settings

## Scope
- Create ApplicationSettings page to manage default selections for userProfile, systemPrompt, and aiModel

## Features

### 1. Settings Page
- Dedicated page accessible via navigation
- Display current default values for each entity type
- Dropdown selectors to change defaults
- Save button to persist changes via API

### 2. Default Settings Management
- Show current default userProfile with name display
- Show current default systemPrompt with label display  
- Show current default aiModel with label display
- Allow selection from available options in each category

### 3. API Integration
- GET current default settings from backend
- PUT/POST updated default settings to backend
- Handle loading and error states appropriately

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
- Add settings endpoints to api.ts service
- Implement GET /api/v1/settings endpoint call
- Implement PUT /api/v1/settings endpoint call

### Settings Page Component
- Create ApplicationSettingsPage component
- Add loading and error state management
- Fetch current settings on page load
- Create form with dropdown selectors
- Implement save functionality with success feedback

### Navigation Integration
- Add ApplicationSettings route to App.tsx
- Add Settings link to Header navigation
- Ensure proper routing between pages

### UI Components
- Create reusable dropdown/select components if needed
- Style settings form consistently with existing pages
- Add proper form validation and error handling

**Status Legend:**
-     Not started
- 🚧 In Progress 
- ✅ Done
- ❌ Aborted