# Roleplay Chat Frontend

A React TypeScript application for managing roleplay characters with a dark theme UI.

## Features

- ✅ Character listing and management
- ✅ Create new characters with form validation  
- ✅ Dark theme throughout the application
- ✅ Modular, scalable architecture
- ✅ Responsive design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API calls
- **CSS Variables** for theming

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## API Configuration

The application expects a backend API at `http://127.0.0.1:5000` with the following endpoints:

- `GET /api/v1/characters/` - List all characters
- `POST /api/v1/characters/` - Create a new character

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, etc.)
│   └── characters/      # Character-specific components
├── pages/               # Page components
├── services/            # API service layer
├── styles/              # Global styles and themes
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks (future)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint