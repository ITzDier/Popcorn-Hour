const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    sinopsis: { type: String, required: true },
    anioEstreno: { type: Number, required: true },
    genero: [{ type: String, required: true }],
    director: { type: String, required: true },
    elenco: [{ type: String, required: true }],
    posterUrl: { type: String, required: true },
    tipo: { type: String, required: true }
});

module.exports = mongoose.model('Media', MediaSchema);