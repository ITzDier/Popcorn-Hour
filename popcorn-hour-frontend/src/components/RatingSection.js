import React, { useState, useEffect } from "react";
import RatingStars from "./RatingStars";
import axios from "axios";

/**
 * Componente para mostrar y enviar calificación de usuario.
 * Experiencia mejorada: loading, feedback, animación, mensajes, indicador de voto, manejo robusto de errores.
 */
export default function RatingSection({ mediaId, userToken }) {
  const [userRating, setUserRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [votes, setVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Obtener promedio y votos
  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const res = await axios.get(`/api/interactions/rating/average/${mediaId}`);
        setAverage(res.data.average || 0);
        setVotes(res.data.count || 0);
      } catch (err) {
        setMsg("No se pudo cargar el promedio.");
        setSuccess(false);
      }
    };

    fetchAverage();

    if (userToken) {
      const fetchUserRating = async () => {
        try {
          const res = await axios.get(`/api/interactions/rating/user/${mediaId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          setUserRating(res.data.rating || 0);
        } catch (err) {
          setMsg("No se pudo cargar tu calificación.");
          setSuccess(false);
        }
      };
      fetchUserRating();
    }
  }, [mediaId, userToken]);

  // Enviar calificación
  const handleRate = async (value) => {
    if (!userToken) {
      setMsg("Debes iniciar sesión para calificar.");
      setSuccess(false);
      return;
    }
    setLoading(true);
    setMsg("");
    setSuccess(false);

    try {
      const res = await axios.post(
        "/api/interactions/rating",
        { mediaId, calificacion: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (res.status === 200) {
        setUserRating(value);
        setMsg("¡Gracias por tu voto! 🎉");
        setSuccess(true);
        // Actualiza promedio y votos
        try {
          const resAvg = await axios.get(`/api/interactions/rating/average/${mediaId}`);
          setAverage(resAvg.data.average || 0);
          setVotes(resAvg.data.count || 0);
        } catch {
          setMsg("¡Votaste! Pero no se pudo actualizar el promedio.");
          setSuccess(true);
        }
      } else {
        setMsg(res.data.msg || "Error al votar. Verifica tu sesión e intenta de nuevo.");
        setSuccess(false);
      }
    } catch (err) {
      setMsg(
        err.response?.data?.msg ||
        "Error de red al votar. ¿Conexión perdida?"
      );
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 24,
        background: "#251038",
        borderRadius: 14,
        padding: 22,
        boxShadow: "0 2px 16px rgba(40,0,70,0.25)",
        color: "#fff",
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      <h3 style={{
        marginBottom: 10,
        color: "#ffb347",
        fontWeight: 700,
        fontSize: "1.2em"
      }}>
        Calificación de usuarios
      </h3>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <RatingStars
          value={userRating || average}
          setValue={handleRate}
          readOnly={!userToken || loading}
        />
      </div>
      <div style={{ marginTop: 10, fontSize: "1.1em" }}>
        <strong style={{ color: "#ffb347" }}>Promedio:</strong>{" "}
        <span style={{ color: "#fff" }}>{average.toFixed(1)} / 10</span>
        {votes > 0 && <span style={{ color: "#bbb" }}> ({votes} voto{votes > 1 ? "s" : ""})</span>}
      </div>
      {userToken && (
        <div style={{ marginTop: 7 }}>
          {userRating
            ? <span style={{ color: "#39e07f", fontWeight: "bold" }}>Tu voto: {userRating} / 10</span>
            : <span style={{ color: "#fff" }}>¡Sé el primero en calificar!</span>
          }
        </div>
      )}
      {loading && (
        <div style={{ color: "#bbb", marginTop: 10, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              border: "2px solid #ffb347",
              borderRadius: "50%",
              width: 18,
              height: 18,
              borderTopColor: "transparent",
              marginRight: 6,
              animation: "spin 0.7s linear infinite"
            }}
          /> Enviando tu voto...
          <style>
            {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      )}
      {msg && (
        <div style={{
          color: success ? "#39e07f" : "#ff4c4c",
          marginTop: 10,
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {msg}
        </div>
      )}
      {!userToken && (
        <div style={{ color: "#bbb", marginTop: 10, textAlign: "center" }}>
          <span role="img" aria-label="lock">🔒</span> Inicia sesión para calificar.
        </div>
      )}
    </div>
  );
}