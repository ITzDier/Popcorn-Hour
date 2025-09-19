const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Favorite = require('../models/Favorite');
const Rating = require('../models/Rating'); // Modelo de calificación
const auth = require('../middleware/auth');

// ----- Comentarios -----

// Crear comentario
router.post('/comment', auth, async (req, res) => {
  try {
    const { mediaId, texto } = req.body;
    if (!mediaId || !texto) {
      return res.status(400).json({ msg: 'Faltan datos para el comentario.' });
    }
    const comment = new Comment({
      mediaId,
      userId: req.user.id,
      texto,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear el comentario.' });
  }
});

// Listar comentarios de una película/serie
router.get('/comment/:mediaId', async (req, res) => {
  try {
    const comments = await Comment.find({ mediaId: req.params.mediaId })
      .populate('userId', 'nombreUsuario');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener comentarios.' });
  }
});

// Borrar comentario (solo el autor)
router.delete('/comment/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado.' });
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No puedes borrar este comentario.' });
    }
    await comment.remove();
    res.json({ msg: 'Comentario eliminado.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al borrar comentario.' });
  }
});

// ----- Favoritos -----

// Marcar como favorito
router.post('/favorite', auth, async (req, res) => {
  try {
    const { mediaId } = req.body;
    if (!mediaId) return res.status(400).json({ msg: 'Falta mediaId.' });
    const existe = await Favorite.findOne({ mediaId, userId: req.user.id });
    if (existe) return res.status(400).json({ msg: 'Ya es favorito.' });

    const fav = new Favorite({ mediaId, userId: req.user.id });
    await fav.save();
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar favorito.' });
  }
});

// Desmarcar favorito
router.delete('/favorite/:mediaId', auth, async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({
      mediaId: req.params.mediaId,
      userId: req.user.id,
    });
    if (!fav) return res.status(404).json({ msg: 'No estaba en favoritos.' });
    res.json({ msg: 'Favorito eliminado.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar favorito.' });
  }
});

// Listar favoritos del usuario
router.get('/favorite', auth, async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.user.id }).populate('mediaId');
    res.json(favs);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener favoritos.' });
  }
});

// Saber si un contenido es favorito del usuario
router.get('/favorite/:mediaId', auth, async (req, res) => {
  try {
    const fav = await Favorite.findOne({ mediaId: req.params.mediaId, userId: req.user.id });
    res.json({ isFavorite: !!fav });
  } catch (err) {
    res.status(500).json({ msg: 'Error al comprobar favorito.' });
  }
});

// ----- Calificaciones -----

// Crear o actualizar calificación de usuario
router.post('/rating', auth, async (req, res) => {
  const { mediaId, calificacion } = req.body;
  if (typeof calificacion !== 'number' || calificacion < 1 || calificacion > 10) {
    return res.status(400).json({ msg: "La calificación debe ser un número entre 1 y 10." });
  }
  try {
    let rating = await Rating.findOneAndUpdate(
      { mediaId, userId: req.user.id },
      { calificacion },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ msg: "Calificación guardada.", rating });
  } catch (err) {
    res.status(500).json({ msg: "Error al guardar calificación." });
  }
});

// Obtener calificación promedio
router.get('/rating/average/:mediaId', async (req, res) => {
  try {
    const mediaId = req.params.mediaId;
    const ratings = await Rating.find({ mediaId });
    if (!ratings.length) return res.json({ average: 0 });
    const sum = ratings.reduce((acc, curr) => acc + curr.calificacion, 0);
    const avg = sum / ratings.length;
    res.json({ average: avg });
  } catch {
    res.status(500).json({ msg: "Error al obtener promedio." });
  }
});

// Obtener calificación de usuario para media
router.get('/rating/user/:mediaId', auth, async (req, res) => {
  try {
    const rating = await Rating.findOne({ mediaId: req.params.mediaId, userId: req.user.id });
    res.json({ rating: rating ? rating.calificacion : 0 });
  } catch {
    res.status(500).json({ msg: "Error al obtener tu calificación." });
  }
});

module.exports = router;