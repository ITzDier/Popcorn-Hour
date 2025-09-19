import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PopcornHourLogo from '../assets/PopcornHourLogo.png';
import './Navbar.css';

function Navbar() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const userRole = role || (user && user.role);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/welcome" className="navbar-logo-link">
          <img src={PopcornHourLogo} alt="Popcorn Hour Logo" className="navbar-logo" />
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/media" className="navbar-link">Catálogo</Link>
          </li>
          <li>
            <Link to="/profile" className="navbar-link">Perfil</Link>
          </li>
          {/* Solo para moderador */}
          {userRole === 'moderador' && (
            <li>
              <Link to="/add-media" className="navbar-link">Agregar contenido</Link>
            </li>
          )}
          {/* Página de favoritos para todos los usuarios */}
          {user && (
            <li>
              <Link to="/favoritos" className="navbar-link">Favoritos</Link>
            </li>
          )}
          <li>
            <button className="navbar-logout-btn" onClick={handleLogoutClick}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;