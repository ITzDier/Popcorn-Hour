import React, { useEffect, useState } from 'react';

const cardStyle = {
    width: '250px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    background: '#1a0826',
    color: '#fff',
    position: 'relative',
    transition: 'transform 0.3s, box-shadow 0.3s'
};

const imgContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '350px',
    overflow: 'hidden',
    cursor: 'pointer'
};

const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'filter 0.3s'
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(30, 0, 60, 0.85)',
    color: '#fff',
    opacity: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.3s'
};

const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '32px',
    padding: '40px'
};

const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    margin: '18px 0 8px 0',
    textAlign: 'center'
};

const genreStyle = {
    fontSize: '1rem',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#ffb347'
};

const ratingStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ff4c4c'
};

export default function MediaList() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/media', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta del backend:', data); // <-- Aquí va el console.log
                if (Array.isArray(data)) {
                    setMedia(data);
                } else {
                    setMedia([]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '60px', fontSize: '1.3rem' }}>Cargando...</div>;
    if (!media || media.length === 0) {
        return (
            <div style={{ color: '#fff', textAlign: 'center', marginTop: '60px', fontSize: '1.3rem' }}>
                No hay contenido disponible.
            </div>
        );
    }

    return (
        <div style={gridStyle}>
            {media.map(item => (
                <div
                    key={item._id}
                    style={{
                        ...cardStyle,
                        transform: hovered === item._id ? 'scale(1.07)' : 'scale(1)',
                        boxShadow: hovered === item._id
                            ? '0 8px 32px rgba(255, 100, 200, 0.25)'
                            : cardStyle.boxShadow
                    }}
                    onMouseEnter={() => setHovered(item._id)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <div style={imgContainerStyle}>
                        <img
                            src={item.posterUrl || 'https://via.placeholder.com/250x350?text=Sin+Imagen'}
                            alt={item.title || item.titulo || 'Sin título'}
                            style={{
                                ...imgStyle,
                                filter: hovered === item._id ? 'brightness(0.5)' : 'brightness(1)'
                            }}
                        />
                        <div
                            style={{
                                ...overlayStyle,
                                opacity: hovered === item._id ? 1 : 0
                            }}
                        >
                            <div style={genreStyle}>
                                {item.genre || item.genero || 'Sin género'}
                            </div>
                            <div style={ratingStyle}>
                                ⭐ {item.rating || item.calificacion || 'Sin calificación'}
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '18px 12px 12px 12px' }}>
                        <div style={titleStyle}>
                            {item.title || item.titulo || 'Sin título'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};