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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;