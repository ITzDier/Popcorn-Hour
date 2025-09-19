import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Bg1 from '../assets/Bg1.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const { login, loading } = useContext(AuthContext); 
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); // Limpia mensajes de error anteriores

        try {
            // CORREGIDO: pasa un objeto con email y password
            await login({ email, password });
            navigate('/welcome'); // Redirección directa después de un inicio de sesión exitoso
        } catch (err) {
            setMsg(err.message || 'Error de inicio de sesión. Credenciales incorrectas.');
        }
    };

    // --- ESTILOS ACTUALIZADOS ---
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

    const inputStyle = {
        width: 'calc(100% - 20px)',
        padding: '14px 10px',
        margin: '12px 0',
        borderRadius: '6px',
        border: '1px solid #444',
        backgroundColor: '#222',
        color: 'white',
        fontSize: '1em',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s'
    };

    const buttonStyle = {
        width: '100%',
        padding: '14px 10px',
        marginTop: '24px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#e50914',
        color: 'white',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    };

    const buttonHoverStyle = {
        backgroundColor: '#f40612'
    };

    const linkStyle = {
        color: isHovered ? '#fff' : '#aaa',
        textDecoration: isHovered ? 'underline' : 'none',
        marginTop: '18px',
        display: 'block',
        fontSize: '1em',
        fontWeight: '500',
        letterSpacing: '0.5px',
        transition: 'color 0.3s, text-decoration 0.3s'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '32px', fontSize: '2.2em', color: '#e50914', letterSpacing: '1px' }}>
                    Iniciar Sesión
                </h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                        style={inputStyle}
                    />
                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                {msg && <p style={{ color: '#f40612', marginTop: '18px', fontWeight: 'bold' }}>{msg}</p>}

                <Link
                    to="/register"
                    style={linkStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    ¿No tienes cuenta? Regístrate aquí.
                </Link>
            </div>
        </div>
    );
};

export default Login;