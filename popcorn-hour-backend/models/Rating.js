const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calificacion: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  }
}, { timestamps: true });

RatingSchema.index({ mediaId: 1, userId: 1 }, { unique: true }); // Un usuario, una calificación por contenido

module.exports = mongoose.model('Rating', RatingSchema);