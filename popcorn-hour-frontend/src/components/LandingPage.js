import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../index.css';
import Bg1 from '../assets/Bg1.png'; 

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  const containerStyle = {
    backgroundImage: `url(${Bg1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  };

  const titleStyle = {
    fontSize: '3em',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px'
  };

  const buttonStyle = {
    padding: '12px 25px',
    fontSize: '1.2em',
    backgroundColor: '#e50914', // Color de botón estilo Netflix
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  // Si el usuario ya está autenticado, no mostramos los botones de registro/login
  if (user) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Bienvenido de nuevo a Popcorn Hour!</h1>
        <p style={{fontSize: '1.2em'}}>Explora tus películas y series favoritas.</p>
        {/* Aquí podrías añadir un botón para ir a la lista de medios si quieres */}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Tu Destino para Películas y Series.</h1>
      <p style={{fontSize: '1.2em', marginBottom: '30px'}}>Regístrate o inicia sesión para disfrutar del mejor contenido.</p>
      <div style={buttonContainerStyle}>
        <Link to="/register" style={buttonStyle}>Registrarse</Link>
        <Link to="/login" style={buttonStyle}>Iniciar Sesión</Link>
      </div>
    </div>
  );
};

export default LandingPage;