# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses vite.config.simple.js for Docker compatibility)
- **Alternative start**: `npx vite --config vite.config.simple.js` (recommended in Docker environments)
- **Build for production**: `npm run build` (runs TypeScript check first)
- **Lint code**: `npm run lint` (ESLint with TypeScript and React rules)
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React TypeScript frontend for a roleplay chat application that communicates with a Flask backend API at `http://127.0.0.1:5000`.

### Core Domain Entities
- **Characters**: Roleplay characters with avatars, descriptions, and first messages
- **User Profiles**: User personas for roleplay sessions
- **System Prompts**: AI behavior configuration templates
- **AI Models**: OpenRouter model configurations
- **Chat Sessions**: Individual conversations between user and character
- **Messages**: Chat messages with streaming support

### Key Architecture Patterns

**API Layer**: Centralized in `src/services/api.ts` with dedicated modules for each domain:
- `charactersApi` - Character CRUD and chat session management
- `userProfilesApi` - User profile management with default profile support
- `systemPromptsApi` - System prompt templates with default selection
- `aiModelsApi` - AI model configurations with default selection
- `settingsApi` - Application settings and OpenRouter API key management
- `chatApi` - Real-time messaging with SSE streaming support

**Text Formatting System**: Advanced roleplay text formatting in `src/utils/textFormatter.ts`:
- Configurable delimiter-based formatting rules (actions: `*text*`, speech: `"text"`, thoughts: `~text~`, emphasis: `_text_`)
- Per-chat session formatting settings with fallback to global defaults
- CSS-in-JS style application with rule precedence handling

**Component Architecture**:
- `src/components/common/` - Shared UI components (Header, FormattedText, FileUpload)
- `src/components/{domain}/` - Domain-specific components with consistent naming patterns
- `src/pages/` - Route-level page components

**File Upload Support**: Multipart form data handling for avatar uploads with automatic content-type switching between JSON and FormData based on file presence.

### Backend Integration

**API Response Format**: All endpoints return standardized format `{ success, data, meta, error }` with consistent data extraction in API layer.

**Real-time Features**: 
- Server-Sent Events (SSE) for streaming chat responses
- Message cancellation support during streaming
- Graceful fallback to non-streaming mode

**Content Management**:
- Avatar image uploads with relative path storage and full URL generation
- First messages system for character initialization
- Message editing and deletion with optimistic updates

### State Management

Uses React built-in state management with:
- Local component state for UI interactions
- API calls trigger re-renders through state updates
- No external state management library (Redux, Zustand, etc.)

### Docker Environment Configuration

The application is designed for Docker deployment:
- Uses `vite.config.simple.js` for simplified Docker-compatible Vite configuration
- Server binds to `0.0.0.0:5173` for external access
- Backend expected at `http://127.0.0.1:5000`

### Development Environment

- **React 19** with TypeScript strict mode
- **Vite** for fast development and building
- **CSS Variables** for theming (dark theme by default)
- **ESLint** with TypeScript and React hooks rules
- No testing framework currently configured