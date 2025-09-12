const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  mediaId: { // El ID de la película o serie
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true,
  },
  userId: { // El ID del usuario que guarda la película
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);