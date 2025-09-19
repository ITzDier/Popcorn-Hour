const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  imagen: {
    type: String // URL de la imagen o poster
  },
  // Puedes agregar más campos según tu necesidad
  // Ejemplo:
  tipo: {
    type: String, // "pelicula", "serie", etc.
    required: true
  },
  año: {
    type: Number
  },
  genero: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Media', MediaSchema);