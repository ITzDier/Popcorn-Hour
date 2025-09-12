// src/components/Profile.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const cardStyle = {
  maxWidth: '400px',
  margin: '60px auto',
  background: 'rgba(30,0,60,0.7)',
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  padding: '36px 32px',
  color: '#fff',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '24px',
  letterSpacing: '1px',
};

const infoStyle = {
  fontSize: '1.15rem',
  margin: '14px 0',
  fontWeight: 500,
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '8px',
  padding: '8px 0',
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #ff4c4c 60%, #ffb347 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 28px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '28px',
  boxShadow: '0 2px 8px rgba(255,76,76,0.15)',
  transition: 'background 0.2s',
};

function Profile() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/api/auth', {
          headers: { 'x-auth-token': token },
        });

        // Si la solicitud es exitosa, cierra la sesión del usuario y redirige
        logout();
        navigate('/');
        alert('Tu cuenta ha sido eliminada con éxito.');
      } catch (err) {
        console.error(err);
        alert('No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.');
      }
    }
  };

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  if (!user) {
    return <h2>Debes iniciar sesión para ver esta página.</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={cardStyle}>
        <div style={titleStyle}>Perfil de Usuario</div>
        <div style={infoStyle}>
          <span>👤 <b>Nombre de Usuario:</b> {user.nombreUsuario}</span>
        </div>
        <div style={infoStyle}>
          <span>📧 <b>Email:</b> {user.email}</span>
        </div>
        <div style={infoStyle}>
          <span>⭐ <b>Tipo de Usuario:</b> {user.tipoUsuario}</span>
        </div>
        <button style={buttonStyle} onClick={handleDeleteAccount}>
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  );
};

export default Profile;