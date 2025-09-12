const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  mediaId: { // El ID de la película o serie
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true,
  },
  userId: { // El ID del usuario que califica
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model('Rating', ratingSchema);