import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MediaDetails = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/media/${id}`);
                setMedia(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error al cargar el contenido. Por favor, revisa la conexión con el servidor.');
                setLoading(false);
            }
        };
        fetchMedia();
    }, [id]);

    if (loading) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Cargando contenido...</h2>;
    }

    if (error) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</h2>;
    }

    if (!media) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Contenido no encontrado.</h2>;
    }

    return (
        <div style={{ padding: '20px', display: 'flex', gap: '40px', alignItems: 'flex-start', color: '#fff' }}>
            <img src={media.posterUrl} alt={media.title} style={{ width: '300px', borderRadius: '10px' }} />
            <div style={{ flex: 1 }}>
                <h1>{media.title} ({media.releaseDate})</h1>
                <p><strong>Sinopsis:</strong> {media.description}</p>
                <p><strong>Director:</strong> {media.director}</p>
                <p><strong>Elenco:</strong> {media.cast?.join(', ')}</p>
                <p><strong>Género:</strong> {media.genre?.join(', ')}</p>
                <p><strong>Tipo:</strong> {media.type}</p>
                {/* Aquí irán los botones y la funcionalidad para comentar, calificar y favoritos */}
            </div>
        </div>
    );
};

export default MediaDetails;