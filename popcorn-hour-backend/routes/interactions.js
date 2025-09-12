const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

// Ruta para añadir o eliminar una película de favoritos.
router.post('/favorites', auth, async (req, res) => {
    try {
        const { mediaId } = req.body;
        const userId = req.user.id;

        // 1. Busca si la película ya está en la lista de favoritos.
        const favorite = await Favorite.findOne({ userId, mediaId });

        if (favorite) {
            // 2. Si existe, la elimina (un-favorite).
            await favorite.deleteOne();
            res.json({ msg: 'Película eliminada de favoritos.' });
        } else {
            // 3. Si no existe, la crea (favorite).
            const newFavorite = new Favorite({
                userId,
                mediaId
            });
            await newFavorite.save();
            res.status(201).json({ msg: 'Película añadida a favoritos.', favorite: newFavorite });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para obtener la lista de favoritos de un usuario.
router.get('/favorites', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const favorites = await Favorite.find({ userId }).populate('mediaId');

        const favoriteMedia = favorites.map(fav => fav.mediaId);

        res.json(favoriteMedia);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para añadir o actualizar una calificación
router.post('/ratings', auth, async (req, res) => {
    try {
        const { mediaId, calificacion } = req.body;
        const userId = req.user.id;

        // Validar que la calificación esté dentro del rango de 1 a 5
        if (calificacion < 1 || calificacion > 5) {
            return res.status(400).json({ msg: 'La calificación debe ser un número entre 1 y 5.' });
        }

        // Buscar si el usuario ya ha calificado esta película
        let rating = await Rating.findOne({ mediaId, userId });

        if (rating) {
            // Si ya existe, actualiza la calificación
            rating.calificacion = calificacion;
            await rating.save();
            return res.json({ msg: 'Calificación actualizada exitosamente.', rating });
        }

        // Si no existe, crea una nueva calificación
        rating = new Rating({ mediaId, userId, calificacion });
        await rating.save();
        res.status(201).json({ msg: 'Calificación añadida exitosamente.', rating });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para añadir un comentario
router.post('/comments', auth, async (req, res) => {
    try {
        const { mediaId, texto } = req.body;
        const userId = req.user.id;

        // Crear una nueva instancia de comentario
        const newComment = new Comment({
            mediaId,
            userId,
            texto
        });

        await newComment.save();
        res.status(201).json({ msg: 'Comentario añadido exitosamente.', comment: newComment });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

module.exports = router;