import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formContainerStyle = {
  background: "rgba(30,0,60,0.7)",
  borderRadius: "16px",
  padding: "32px",
  maxWidth: "820px",
  margin: "60px auto 32px auto",
  color: "#fff",
  boxShadow: "0 8px 32px rgba(0,0,0,0.22)"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "none",
  fontSize: "1.1rem",
  background: "#2d0b24",
  color: "#fff"
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "6px",
  display: "block",
  color: "#ffb347"
};

const buttonStyle = {
  background: "linear-gradient(90deg, #e50914 60%, #ffb347 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 28px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  cursor: "pointer",
  marginTop: "12px",
  boxShadow: "0 2px 8px rgba(215,38,61,0.15)",
  transition: "background 0.2s"
};

function AddMedia() {
  const { user, role } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    titulo: '',
    sinopsis: '',
    anioEstreno: '',
    genero: '',
    director: '',
    elenco: '',
    tipo: 'pelicula'
  });
  const [poster, setPoster] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const { titulo, sinopsis, anioEstreno, genero, director, elenco, tipo } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = e => setPoster(e.target.files[0]);

  const onSubmit = async e => {
    e.preventDefault();
    if (isNaN(anioEstreno) || anioEstreno.trim() === '') {
      setMsg('El año de estreno debe ser un número válido.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMsg('No estás autorizado para subir contenido.');
        return;
      }
      const data = new FormData();
      data.append('titulo', titulo);
      data.append('sinopsis', sinopsis);
      data.append('anioEstreno', anioEstreno);
      data.append('genero', genero);
      data.append('director', director);
      data.append('elenco', elenco);
      data.append('tipo', tipo);
      if (poster) {
        data.append('poster', poster);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      };
      // CORREGIDO: Usar ruta relativa para aprovechar el proxy
      const res = await axios.post('/api/media', data, config);
      setMsg(res.data.msg || "¡Contenido subido correctamente!");
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error al subir la película.');
    }
  };

  if (role !== 'moderador') {
    return (
      <div style={formContainerStyle}>
        <h2 style={{ color: "#ff4c4c", textAlign: "center" }}>Acceso solo para moderadores</h2>
      </div>
    );
  }

  return (
    <div style={formContainerStyle}>
      <h1 style={{ textAlign: "center", fontWeight: "bold", color: "#ffb347", marginBottom: "34px" }}>Subir Contenido</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Título</label>
          <input type="text" name="titulo" value={titulo} onChange={onChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "2 1 340px", minWidth: "220px" }}>
          <label style={labelStyle}>Sinopsis</label>
          <textarea name="sinopsis" value={sinopsis} onChange={onChange} style={{ ...inputStyle, minHeight: "60px" }} required />
        </div>
        <div style={{ flex: "1 1 180px", minWidth: "180px" }}>
          <label style={labelStyle}>Año de estreno</label>
          <input type="text" name="anioEstreno" value={anioEstreno} onChange={onChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Género <span style={{ fontWeight: "normal" }}>(separado por comas)</span></label>
          <input type="text" name="genero" value={genero} onChange={onChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
          <label style={labelStyle}>Director</label>
          <input type="text" name="director" value={director} onChange={onChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "2 1 320px", minWidth: "220px" }}>
          <label style={labelStyle}>Elenco <span style={{ fontWeight: "normal" }}>(separado por comas)</span></label>
          <input type="text" name="elenco" value={elenco} onChange={onChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "1 1 130px", minWidth: "130px" }}>
          <label style={labelStyle}>Tipo</label>
          <select name="tipo" value={tipo} onChange={onChange} style={inputStyle}>
            <option value="pelicula">Película</option>
            <option value="serie">Serie</option>
          </select>
        </div>
        <div style={{ flex: "2 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Imagen/Poster</label>
          <input type="file" name="poster" onChange={onFileChange} style={inputStyle} required />
        </div>
        <div style={{ flex: "1 1 100px", minWidth: "100px", alignSelf: "flex-end" }}>
          <button type="submit" style={buttonStyle}>Subir contenido</button>
        </div>
      </form>
      {msg && <p style={{ color: "#ffb347", textAlign: "center", marginTop: "18px", fontWeight: "bold" }}>{msg}</p>}
    </div>
  );
}

export default AddMedia;