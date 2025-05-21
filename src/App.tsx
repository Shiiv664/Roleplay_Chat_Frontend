import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import CharactersPage from './pages/CharactersPage';
import UserProfilesPage from './pages/UserProfilesPage';
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
            <Route path="/user-profiles" element={<UserProfilesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;