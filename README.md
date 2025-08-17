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

### Installation

```bash
npm install
```

### Development

**Integrated Development (Recommended):**
Run both frontend and backend together from the backend directory:

```bash
cd ../Roleplay_Chat_Backend
./scripts/dev-start.sh    # Starts both servers
./scripts/status.sh       # Check server status  
./scripts/logs.sh         # View logs
./scripts/dev-stop.sh     # Stop both servers
```

**Frontend Only:**
```bash
npm run dev
```

**Development URLs:**
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000) (or configured port)
- **API Docs**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)

### Production Deployment

For production deployment, use the scripts in the backend directory:

```bash
cd ../Roleplay_Chat_Backend
./scripts/build-frontend.sh  # Build frontend and copy to backend
./scripts/prod-start.sh      # Start production server
./scripts/prod-stop.sh       # Stop production server
./scripts/deploy.sh          # Full deployment (build + start)
```

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

The application expects a backend API (default `http://127.0.0.1:8000`, configurable via VITE_API_BASE_URL) with the following endpoints:

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

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Deployment Scripts (Backend Directory)
- `./scripts/dev-start.sh` - Start both frontend and backend
- `./scripts/dev-stop.sh` - Stop both servers
- `./scripts/status.sh` - Check server status
- `./scripts/logs.sh` - View server logs
- `./scripts/build-frontend.sh` - Build frontend for production
- `./scripts/prod-start.sh` - Start production server
- `./scripts/prod-stop.sh` - Stop production server
- `./scripts/deploy.sh` - Full deployment process
