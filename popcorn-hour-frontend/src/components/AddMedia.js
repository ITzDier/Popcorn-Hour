import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddMedia() {
  const { user } = useContext(AuthContext);
  const role = user?.role; // Obtén el rol desde el usuario
  const [formData, setFormData] = useState({
    titulo: '',
    sinopsis: '',
    anioEstreno: '',
    genero: '',
    director: '',
    elenco: '',
    tipo: 'pelicula' // Por defecto, el tipo es "pelicula"
  });
  const [poster, setPoster] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const { titulo, sinopsis, anioEstreno, genero, director, elenco, tipo } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = e => setPoster(e.target.files[0]);

  const onSubmit = async e => {
    e.preventDefault();

    // Validar que anioEstreno sea un número
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

      const res = await axios.post('http://localhost:5000/api/media', data, config);
      setMsg(res.data.msg);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      setMsg(err.response?.data?.msg || 'Error al subir la película.');
    }
  };

  if (role !== 'moderador') {
    return <p>Acceso solo para moderadores.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Subir Contenido</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Título" name="titulo" value={titulo} onChange={onChange} required />
        <textarea placeholder="Sinopsis" name="sinopsis" value={sinopsis} onChange={onChange} required></textarea>
        <input type="text" placeholder="Año de estreno" name="anioEstreno" value={anioEstreno} onChange={onChange} required />
        <input type="text" placeholder="Género (separado por comas)" name="genero" value={genero} onChange={onChange} required />
        <input type="text" placeholder="Director" name="director" value={director} onChange={onChange} required />
        <input type="text" placeholder="Elenco (separado por comas)" name="elenco" value={elenco} onChange={onChange} required />
        <select name="tipo" value={tipo} onChange={onChange}>
          <option value="pelicula">Película</option>
          <option value="serie">Serie</option>
        </select>
        <input type="file" name="poster" onChange={onFileChange} required />
        <button type="submit">Subir</button>
      </form>
      {msg && <p>{msg}</p>}
      {user && user.role === 'moderador' && (
        <button onClick={() => window.location.href = '/add-media'}>
          Subir contenido
        </button>
      )}
    </div>
  );
}

export default AddMedia;