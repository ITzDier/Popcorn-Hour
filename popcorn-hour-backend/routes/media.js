const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Ver catálogo (solo usuarios autenticados)
router.get('/', auth, async (req, res) => {
    try {
        const media = await Media.find();
        res.json(media);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener el catálogo' });
    }
});

// Si quieres que sea público, elimina `auth`:
// router.get('/', async (req, res) => {
//     try {
//         const media = await Media.find();
//         res.json(media);
//     } catch (err) {
//         res.status(500).json({ msg: 'Error al obtener el catálogo' });
//     }
// });

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