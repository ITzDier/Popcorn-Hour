import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Bg1 from '../assets/Bg1.png';

const Register = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('estandar'); // Usar 'role' para coincidir con backend
    const [msg, setMsg] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            await register(nombreUsuario, email, password, role); // Pasa el rol seleccionado
            navigate('/login');
        } catch (err) {
            setMsg(err.message || 'Error al registrar usuario.');
        }
    };

    // Estilos
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
        backgroundColor: 'rgba(25, 25, 25, 0.9)',
        padding: '50px',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const inputStyle = {
        width: 'calc(100% - 20px)',
        padding: '12px 10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #555',
        backgroundColor: '#333',
        color: 'white',
        fontSize: '1em',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px 10px',
        marginTop: '20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#e50914',
        color: 'white',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    };

    const buttonHoverStyle = {
        backgroundColor: '#f40612'
    };

    const linkStyle = {
        color: '#aaa',
        textDecoration: 'none',
        marginTop: '15px',
        display: 'block',
        fontSize: '0.9em'
    };

    const linkHoverStyle = {
        color: 'white'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '30px', fontSize: '2em', color: '#e50914' }}>Registro de Usuario</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        placeholder="Nombre de usuario"
                        required
                        style={inputStyle}
                    />
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
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="estandar">Estándar</option>
                        <option value="moderador">Moderador</option>
                    </select>
                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        Registrarse
                    </button>
                </form>
                {msg && <p style={{ color: '#f40612', marginTop: '15px' }}>{msg}</p>}

                <Link
                    to="/login"
                    style={linkStyle}
                    onMouseOver={(e) => e.target.style.color = linkHoverStyle.color}
                    onMouseOut={(e) => e.target.style.color = linkStyle.color}
                >
                    ¿Ya tienes cuenta? Inicia sesión aquí.
                </Link>
            </div>
        </div>
    );
};

export default Register;