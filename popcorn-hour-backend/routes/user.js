const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
// Puedes agregar otros modelos si tienes más funciones de usuario

// Obtener información del usuario autenticado
router.get('/me', auth, async (req, res) => {
  // Ejemplo básico de endpoint de perfil
  res.json({ id: req.user.id, role: req.user.role });
});

// RUTA CORRECTA PARA FAVORITOS
router.get('/favoritos', auth, async (req, res) => {
  console.log('GET /favoritos: userId =', req.user.id);
  try {
    const favoritos = await Favorite.find({ userId: req.user.id }).populate('mediaId');
    const datosFavoritos = favoritos.map(fav => fav.mediaId);
    res.json(datosFavoritos);
  } catch (err) {
    console.log('Error en GET /favoritos:', err);
    res.status(500).json({ msg: 'Error al obtener favoritos.' });
  }
});

// Agregar favorito
router.post('/favoritos/:mediaId', auth, async (req, res) => {
  try {
    const existe = await Favorite.findOne({ userId: req.user.id, mediaId: req.params.mediaId });
    if (existe) {
      return res.status(400).json({ msg: 'Ya está agregado a favoritos.' });
    }
    const nuevoFavorito = new Favorite({
      userId: req.user.id,
      mediaId: req.params.mediaId
    });
    await nuevoFavorito.save();
    res.json({ msg: 'Agregado a favoritos.' });
  } catch (err) {
    console.log('Error en POST /favoritos:', err);
    res.status(500).json({ msg: 'Error al agregar favorito.' });
  }
});

// Eliminar favorito
router.delete('/favoritos/:mediaId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      mediaId: req.params.mediaId
    });
    res.json({ msg: 'Eliminado de favoritos.' });
  } catch (err) {
    console.log('Error en DELETE /favoritos:', err);
    res.status(500).json({ msg: 'Error al eliminar favorito.' });
  }
});

// Aquí puedes agregar más rutas de usuario si lo necesitas

module.exports = router;