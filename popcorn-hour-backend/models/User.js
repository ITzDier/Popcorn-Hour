const mongoose = require('mongoose');
const crypto = require('crypto'); // Necesitas la librería nativa 'crypto' de Node.js

const userSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['moderador', 'estandar'],
    default: 'estandar'
  },
  auth2faSecret: { 
    type: String,
    required: false
  },
  is2faEnabled: { 
    type: Boolean,
    default: false
  },
  resetPasswordToken: String, // Campo para el token de restablecimiento
  resetPasswordExpire: Date // Fecha de expiración del token
});

// Función para generar un token de restablecimiento
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expira en 10 minutos
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);