const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  mediaId: { // El ID de la película o serie
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true,
  },
  userId: { // El ID del usuario que comenta
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  texto: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);