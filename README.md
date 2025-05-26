# Roleplay Chat Frontend

A React TypeScript application for managing roleplay characters with a dark theme UI and advanced text formatting features.

## Features

- ✅ Character listing and management
- ✅ Create new characters with form validation  
- ✅ Real-time roleplay chat with characters
- ✅ **Text formatting system** with customizable delimiters
- ✅ Message history and management
- ✅ Dark theme throughout the application
- ✅ Modular, scalable architecture
- ✅ Responsive design

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API calls
- **CSS Variables** for theming

## Getting Started

### Prerequisites
This project is designed to run in a Docker container environment with port 5173 forwarded.

### Installation & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npx vite --config vite.config.simple.js
   ```
   
   **Note**: The standard `npm run dev` command may not work in the Docker container environment. Use the npx command above instead.

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Text Formatting Feature

The application includes a powerful text formatting system for roleplay messages:

### Default Formatting Rules
- **Actions** (`*text*`): Italic, brown color, Georgia font
- **Speech** (`"text"`): Green color, Arial font  
- **Thoughts** (`~text~`): Italic, blue color, smaller size, Times New Roman
- **Emphasis** (`_text_`): Bold, red color

### Usage
1. In any chat, click the "..." menu in the header
2. Select "Configure Formatting"
3. Enable/disable formatting and customize rules
4. Send messages like: `*walks into room* "Hello there!" ~thinking about lunch~`

## API Configuration

The application expects a backend API at `http://127.0.0.1:5000` with the following endpoints:

### Core Endpoints
- `GET /api/v1/characters/` - List all characters
- `POST /api/v1/characters/` - Create a new character
- `GET/POST /api/v1/chat-sessions/` - Chat session management
- `GET/POST /api/v1/messages/` - Message management

### Text Formatting Endpoints
- `PUT /api/v1/chat-sessions/{id}/formatting` - Update chat formatting settings
- `GET /api/v1/settings/default-formatting-rules` - Get default formatting rules
- `PUT /api/v1/settings/default-formatting-rules` - Update default formatting rules

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, FormattedText, etc.)
│   ├── characters/      # Character-specific components
│   └── chat/            # Chat-related components
├── pages/               # Page components
├── services/            # API service layer
├── styles/              # Global styles and themes
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (text formatting, etc.)
└── hooks/               # Custom React hooks (future)
```

## Available Scripts

- `npx vite --config vite.config.simple.js` - Start development server (recommended)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Docker Environment

This project is designed to run in a Docker container with:
- Frontend port: 5173 (forwarded)
- Backend port: 5000 (internal)
- Volume mounts for development

If you encounter issues with `npm run dev`, use the npx command directly as shown above.
