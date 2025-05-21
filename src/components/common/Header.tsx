import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title">Roleplay Chat</h1>
          <nav className="nav">
            <Link to="/characters" className="nav-link">
              Characters
            </Link>
            <Link to="/user-profiles" className="nav-link">
              User Profiles
            </Link>
            <Link to="/system-prompts" className="nav-link">
              System Prompts
            </Link>
            <Link to="/ai-models" className="nav-link">
              AI Models
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;