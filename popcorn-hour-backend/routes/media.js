const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Si tienes modelos para Rating y Comment:
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

// Ver catálogo (solo usuarios autenticados)
router.get('/', auth, async (req, res) => {
    try {
        const media = await Media.find();
        res.json(media);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener el catálogo' });
    }
});

// Subir contenido (solo moderadores)
router.post('/', auth, role('moderador'), async (req, res) => {
    try {
        const newMedia = new Media(req.body);
        await newMedia.save();
        res.status(201).json(newMedia);
    } catch (err) {
        res.status(500).json({ msg: 'Error al subir contenido' });
    }
});

// Eliminar contenido (solo moderadores)
router.delete('/:id', auth, role('moderador'), async (req, res) => {
    try {
        const media = await Media.findByIdAndDelete(req.params.id);
        if (!media) {
            return res.status(404).json({ msg: 'Contenido no encontrado.' });
        }
        res.json({ msg: 'Contenido eliminado correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al eliminar el contenido.' });
    }
});

// Ruta para obtener una película por su ID
router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ msg: 'Película no encontrada.' });
        }
        res.json(media);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Calificar película o serie (usuario autenticado)
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const { calificacion } = req.body;
        const mediaId = req.params.id;
        const userId = req.user.id;

        // Busca si el usuario ya calificó
        let rating = await Rating.findOne({ mediaId, userId });
        if (rating) {
            rating.calificacion = calificacion;
            await rating.save();
        } else {
            rating = new Rating({ mediaId, userId, calificacion });
            await rating.save();
        }
        res.json({ msg: 'Calificación guardada.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al calificar.' });
    }
});

// Ruta para obtener calificaciones y comentarios de una película
router.get('/:id/details', async (req, res) => {
    try {
        const mediaId = req.params.id;

        // Obtener calificaciones y calcular el promedio
        const ratings = await Rating.find({ mediaId });
        const avgRating = ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.calificacion, 0) / ratings.length
            : 0;

        // Obtener comentarios y popular los datos del usuario
        const comments = await Comment.find({ mediaId }).populate('userId', 'nombreUsuario');

        res.json({
            calificacionPromedio: avgRating,
            comentarios: comments
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

module.exports = router;