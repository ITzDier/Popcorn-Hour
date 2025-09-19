const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media', // Cambia "Media" por el nombre real de tu modelo de películas/series
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Favorite', FavoriteSchema);