import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const pageStyle = {
  padding: '40px',
  minHeight: 'calc(100vh - 80px)',
  background: 'transparent',
};

const cardStyle = {
  background: 'rgba(30,0,60,0.7)',
  borderRadius: '14px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
  padding: '18px',
  width: '230px',
  textAlign: 'center',
  color: '#fff',
  marginBottom: '30px',
  transition: 'transform 0.18s, box-shadow 0.18s',
  cursor: 'pointer',
};

const imgStyle = {
  width: '100%',
  borderRadius: '8px',
  marginBottom: '10px',
  objectFit: 'cover',
  maxHeight: '340px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #ff4c4c 60%, #ffb347 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 2px 8px rgba(255,76,76,0.15)',
  transition: 'background 0.2s',
};

function Favoritos() {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // CORREGIDO: Usar ruta relativa
    axios.get('/api/user/favoritos', {
      headers: { 'x-auth-token': token }
    })
    .then(res => {
      setFavoritos(res.data);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      alert('Error al cargar favoritos');
    });
  }, []);

  const handleDelete = (mediaId) => {
    const token = localStorage.getItem('token');
    // CORREGIDO: Usar ruta relativa
    axios.delete(`/api/user/favoritos/${mediaId}`, {
      headers: { 'x-auth-token': token }
    })
    .then(() => {
      setFavoritos(favoritos.filter(f => f._id !== mediaId));
    })
    .catch(err => {
      alert('No se pudo eliminar el favorito');
    });
  };

  if (loading) return <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '80px' }}>Cargando favoritos...</h2>;
  if (!user) return <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '80px' }}>Debes iniciar sesión para ver tus favoritos.</h2>;

  return (
    <div style={pageStyle}>
      <h2 style={{
        color: '#fff',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        marginBottom: '38px'
      }}>
        Mis Favoritos
      </h2>
      {favoritos.length === 0
        ? <p style={{ color: '#eee', textAlign: 'center', fontSize: '1.25rem' }}>No tienes favoritos aún.</p>
        : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'center' }}>
            {favoritos.map(media => (
              <div
                key={media._id}
                style={
                  hovered === media._id
                    ? {
                        ...cardStyle,
                        transform: 'scale(1.06)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.42)',
                      }
                    : cardStyle
                }
                onMouseEnter={() => setHovered(media._id)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link to={`/media/${media._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={media.posterUrl || media.imagen} alt={media.titulo} style={imgStyle} />
                  <h4 style={{ margin: '12px 0 4px 0', fontWeight: 'bold', fontSize: '1.18rem' }}>{media.titulo}</h4>
                </Link>
                <button
                  style={buttonStyle}
                  onClick={() => handleDelete(media._id)}
                >
                  Eliminar de favoritos
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default Favoritos;