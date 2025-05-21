# Roadmap Phase 3: System Prompts & AI Models

## Scope
- Add System Prompts and AI Models management functionality

## Features

### 1. System Prompts Page
- List all system prompts
- Create new system prompts
- Display label and content

### 2. AI Models Page  
- List all AI models
- Create new AI models
- Display label and description

### 3. Header Integration
- Add "System Prompts" and "AI Models" navigation links

## Technical Tasks
- Create SystemPromptsPage component
- Create AIModelsPage component
- Implement respective List and Card components
- Develop Create modals for both entities
- Update Header with new navigation links
- Extend API services for both endpoints

## Technical Requirements
- React components with TypeScript
- React Router for navigation
- HTTP client for API calls (to http://127.0.0.1:5000)
- Maintain dark theme throughout components
- Follow modular component architecture
- Maintain scalable project structure
- Simple styling/layout approach

## Implementation Steps

### Header Updates
- Add "System Prompts" and "AI Models" navigation links
- Update routing configuration

### API Integration
- Extend API service for system prompts endpoints (GET/POST)
- Extend API service for AI models endpoints (GET/POST)

### System Prompts Feature
- Create SystemPromptsPage, SystemPromptList, SystemPromptCard components
- Implement CreateSystemPromptModal with form validation
- Connect to API service

### AI Models Feature
- Create AIModelsPage, AIModelList, AIModelCard components
- Implement CreateAIModelModal with form validation
- Connect to API service

**Status Legend:**
-     Not started
- 🚧 In Progress 
- ✅ Done
- ❌ Aborted