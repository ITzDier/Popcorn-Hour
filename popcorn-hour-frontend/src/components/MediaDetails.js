import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RatingSection from './RatingSection';

const commentBoxStyle = {
    background: "#1a0826",
    borderRadius: "12px",
    padding: "18px",
    marginTop: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    color: "#fff"
};

const commentListStyle = {
    marginTop: "18px"
};

const favoriteButtonStyle = isFavorite => ({
    background: isFavorite ? "#ff4c4c" : "#3f0f36",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "18px",
    transition: "background 0.3s"
});

const deleteContentButtonStyle = {
    background: 'linear-gradient(90deg, #d7263d 60%, #ffb347 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '14px',
    width: '100%',
    boxShadow: '0 2px 8px rgba(215,38,61,0.15)'
};

const MediaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, role } = useContext(AuthContext);
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentMsg, setCommentMsg] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [favMsg, setFavMsg] = useState('');
    const [deleteMsg, setDeleteMsg] = useState('');

    // Cargar media
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                // CORREGIDO: Usar ruta relativa
                const res = await axios.get(`/api/media/${id}`);
                setMedia(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el contenido. Por favor, revisa la conexión con el servidor.');
                setLoading(false);
            }
        };
        fetchMedia();
    }, [id]);

    // Cargar comentarios
    useEffect(() => {
        const fetchComments = async () => {
            try {
                // CORREGIDO: Usar ruta relativa
                const res = await axios.get(`/api/interactions/comment/${id}`);
                setComments(res.data);
            } catch (err) {
                setComments([]);
            }
        };
        if (id) fetchComments();
    }, [id]);

    // Saber si es favorito
    useEffect(() => {
        const fetchFavorite = async () => {
            if (!user) return setIsFavorite(false);
            try {
                const token = localStorage.getItem('token');
                // CORREGIDO: Usar ruta relativa
                const res = await axios.get(`/api/interactions/favorite/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(res.data.isFavorite);
            } catch {
                setIsFavorite(false);
            }
        };
        fetchFavorite();
    }, [id, user]);

    // Comentar
    const handleCommentSubmit = async e => {
        e.preventDefault();
        if (!user) {
            setCommentMsg("Debes iniciar sesión para comentar.");
            return;
        }
        if (!newComment.trim()) return;
        try {
            const token = localStorage.getItem('token');
            // CORREGIDO: Usar ruta relativa
            const res = await axios.post(
                '/api/interactions/comment',
                { mediaId: id, texto: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(prev => [...prev, { ...res.data, userId: { nombreUsuario: user.nombreUsuario } }]);
            setNewComment('');
            setCommentMsg('Comentario agregado.');
        } catch (err) {
            setCommentMsg('Error al agregar comentario.');
        }
    };

    // Borrar comentario
    const handleDeleteComment = async commentId => {
        try {
            const token = localStorage.getItem('token');
            // CORREGIDO: Usar ruta relativa
            await axios.delete(`/api/interactions/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch {
            setCommentMsg('No puedes borrar este comentario.');
        }
    };

    // Marcar/desmarcar favorito
    const handleFavoriteToggle = async () => {
        if (!user) {
            setFavMsg("Debes iniciar sesión para agregar favoritos.");
            return;
        }
        const token = localStorage.getItem('token');
        try {
            if (isFavorite) {
                // CORREGIDO: Usar ruta relativa
                await axios.delete(`/api/interactions/favorite/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(false);
                setFavMsg("Eliminado de favoritos.");
            } else {
                // CORREGIDO: Usar ruta relativa
                await axios.post(
                    `/api/interactions/favorite`,
                    { mediaId: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(true);
                setFavMsg("Agregado a favoritos.");
            }
        } catch {
            setFavMsg('Error al modificar favoritos.');
        }
    };

    // SOLO MODERADORES PUEDEN BORRAR EL CONTENIDO
    const handleDeleteContent = async () => {
        if (window.confirm("¿Estás seguro de que deseas borrar este contenido? Esta acción es irreversible.")) {
            try {
                const token = localStorage.getItem('token');
                // CORREGIDO: Usar ruta relativa
                await axios.delete(`/api/media/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDeleteMsg('Contenido borrado correctamente.');
                setTimeout(() => {
                    navigate('/media'); // Redirige al catálogo tras borrar
                }, 1500);
            } catch (err) {
                setDeleteMsg('Error al borrar el contenido.');
            }
        }
    };

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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={media.posterUrl} alt={media.titulo || media.title} style={{ width: '300px', borderRadius: '10px' }} />
                {role === 'moderador' && (
                    <button
                        style={deleteContentButtonStyle}
                        onClick={handleDeleteContent}
                    >
                        Borrar contenido
                    </button>
                )}
                {deleteMsg && <div style={{ color: "#ffb347", marginTop: "10px" }}>{deleteMsg}</div>}
            </div>
            <div style={{ flex: 1 }}>
                <h1>
                    {media.titulo || media.title} ({media.anioEstreno || media.releaseDate})
                </h1>

                {/* Calificación de usuarios con experiencia mejorada */}
                <RatingSection mediaId={id} userToken={localStorage.getItem('token')} />

                <p><strong>Sinopsis:</strong> {media.sinopsis || media.description}</p>
                <p><strong>Director:</strong> {media.director}</p>
                <p><strong>Elenco:</strong> {(media.elenco || media.cast)?.join(', ')}</p>
                <p><strong>Género:</strong> {(media.genero || media.genre)?.join(', ')}</p>
                <p><strong>Tipo:</strong> {media.tipo || media.type}</p>
                <button
                    style={favoriteButtonStyle(isFavorite)}
                    onClick={handleFavoriteToggle}
                >
                    {isFavorite ? "★ Favorito" : "☆ Agregar a favoritos"}
                </button>
                {favMsg && <div style={{ color: "#ffb347", marginBottom: "10px" }}>{favMsg}</div>}

                <div style={commentBoxStyle}>
                    <h2 style={{ marginBottom: "12px" }}>Comentarios</h2>
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: "16px" }}>
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            style={{ width: "100%", minHeight: "60px", borderRadius: "6px", padding: "8px", border: "none", background: "#2d0b24", color: "#fff" }}
                        />
                        <button type="submit" style={{
                            marginTop: "8px", padding: "8px 16px", borderRadius: "6px", border: "none", background: "#e50914", color: "#fff", fontWeight: "bold", cursor: "pointer"
                        }}>
                            Comentar
                        </button>
                    </form>
                    {commentMsg && <div style={{ color: "#ffb347" }}>{commentMsg}</div>}
                    <div style={commentListStyle}>
                        {comments.length === 0 ? (
                            <div style={{ color: "#bbb" }}>Sé el primero en comentar.</div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment._id} style={{
                                    marginBottom: "16px",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    background: "#2d0b24",
                                    position: "relative"
                                }}>
                                    <span style={{ fontWeight: "bold", color: "#ffb347" }}>
                                        {comment.userId?.nombreUsuario || "Anónimo"}
                                    </span>
                                    <span style={{ marginLeft: "16px", fontSize: "0.95em", color: "#bbb" }}>
                                        {new Date(comment.fecha).toLocaleString()}
                                    </span>
                                    <p style={{ marginTop: "8px" }}>{comment.texto}</p>
                                    {user && comment.userId && comment.userId.nombreUsuario === user.nombreUsuario && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                background: "transparent",
                                                color: "#ff4c4c",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                            title="Eliminar comentario"
                                        >✖</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaDetails;