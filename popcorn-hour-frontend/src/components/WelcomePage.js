// src/components/WelcomePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Bg1 from '../assets/Bg1.png';

const WelcomePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const containerStyle = {
        backgroundImage: `url(${Bg1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    };

    const cardStyle = {
        backgroundColor: 'rgba(25, 25, 25, 0.92)',
        padding: '50px 40px',
        borderRadius: '16px',
        color: 'white',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
    };

    const buttonStyle = {
        marginTop: '32px',
        padding: '14px 32px',
        borderRadius: '6px',
        border: '2px solid #e50914',
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s'
    };

    const buttonHoverStyle = {
        backgroundColor: '#e50914',
        color: '#fff'
    };

    const handleExploreClick = () => {
        navigate('/media');
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: 'red', textAlign: 'center' }}>
                    Bienvenido {user && user.nombreUsuario ? user.nombreUsuario : ''}
                </h1>
                <p style={{ textAlign: 'center' }}>
                    Empieza a explorar nuestro catálogo de películas y series.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        style={buttonStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
                            e.currentTarget.style.color = buttonHoverStyle.color;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
                            e.currentTarget.style.color = buttonStyle.color;
                        }}
                        onClick={handleExploreClick}
                    >
                        Explora ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;