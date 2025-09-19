//Logica ya implementada en interactions.js. Se deja por si se quiere separar la logica de favoritos en un futuro.
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Debes tener este middleware
const User = require('../models/User');
const Media = require('../models/Media');

// Obtener favoritos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoritos');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado.' });
    res.json(user.favoritos);
  } catch (err) {
    console.error('Error al obtener favoritos:', err);
    res.status(500).json({ msg: 'Error al obtener favoritos.' });
  }
});

// Agregar un favorito
router.post('/:mediaId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const mediaId = req.params.mediaId;
    if (!user || !mediaId) return res.status(400).json({ msg: 'Datos inválidos.' });
    if (!user.favoritos.includes(mediaId)) {
      user.favoritos.push(mediaId);
      await user.save();
    }
    res.json({ msg: 'Agregado a favoritos.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar favorito.' });
  }
});

// Eliminar un favorito
router.delete('/:mediaId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const mediaId = req.params.mediaId;
    if (!user || !mediaId) return res.status(400).json({ msg: 'Datos inválidos.' });
    user.favoritos = user.favoritos.filter(id => id.toString() !== mediaId);
    await user.save();
    res.json({ msg: 'Eliminado de favoritos.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar favorito.' });
  }
});

module.exports = router;