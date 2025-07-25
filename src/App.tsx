import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import CharactersPage from './pages/CharactersPage';
import UserProfilesPage from './pages/UserProfilesPage';
import SystemPromptsPage from './pages/SystemPromptsPage';
import AIModelsPage from './pages/AIModelsPage';
import ApplicationSettingsPage from './pages/ApplicationSettingsPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import CharacterEditPage from './pages/CharacterEditPage';
import ChatPage from './pages/ChatPage';
import './styles/theme.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/characters" replace />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
            <Route path="/characters/:id/edit" element={<CharacterEditPage />} />
            <Route path="/chat/:chatSessionId" element={<ChatPage />} />
            <Route path="/user-profiles" element={<UserProfilesPage />} />
            <Route path="/system-prompts" element={<SystemPromptsPage />} />
            <Route path="/ai-models" element={<AIModelsPage />} />
            <Route path="/settings" element={<ApplicationSettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;