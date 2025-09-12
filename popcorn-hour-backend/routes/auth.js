const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// ... La ruta de registro va aquí ...
router.post('/register', async (req, res) => {
    const { nombreUsuario, email, password, tipoUsuario } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe.' });
        }

        // Crear nuevo usuario
        user = new User({
            nombreUsuario,
            email,
            password, // Se hashea más abajo
            tipoUsuario
        });

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Generar secreto para 2FA (opcional, si planeas habilitarlo después)
        user.auth2faSecret = speakeasy.generateSecret({ length: 20 }).base32;
        user.is2faEnabled = false; // Deshabilitado por defecto

        await user.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta de inicio de sesión con 2FA integrada
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        // Mostrar credenciales en consola
        console.log('Usuario logueado:', {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        });

        // Genera el token (ajusta según tu método)
        const token = generateToken(user);

        // Retorna el usuario y el token
        res.json({
            token,
            user: {
                _id: user._id,
                nombreUsuario: user.nombreUsuario,
                email: user.email,
                role: user.tipoUsuario // <-- aquí mapeas tipoUsuario a role
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// @route   POST api/auth/forgot-password
// @desc    Solicitar restablecimiento de contraseña
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Genera el token y lo guarda en el usuario
        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Crea el enlace de restablecimiento
        const resetUrl = `http://tu-frontend.com/reset-password/${resetToken}`;

        // Configura el transportador de correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // O el servicio que uses, como 'SendGrid', etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Opciones del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Restablecimiento de Contraseña',
            html: `<h1>Restablecer Contraseña</h1><p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">Restablecer Contraseña</a>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: 'Correo de restablecimiento enviado.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// @route   POST api/auth/reset-password/:token
// @desc    Restablecer contraseña con el token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { password } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() } // Verifica que el token no haya expirado
        });

        if (!user) {
            return res.status(400).json({ msg: 'Token de restablecimiento inválido o expirado.' });
        }

        // Hashea la nueva contraseña y la guarda en el usuario
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Limpia los campos de restablecimiento después de usarlos
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.json({ msg: 'Contraseña restablecida exitosamente.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// @route   GET api/auth
// @desc    Obtener datos del usuario
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            nombreUsuario: user.nombreUsuario,
            email: user.email,
            role: user.tipoUsuario // <-- aquí también
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener el usuario' });
    }
});

// @route   DELETE api/auth
// @desc    Eliminar la cuenta del usuario autenticado
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Encontrar y eliminar el usuario. req.user.id viene del token de autenticación.
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: 'Cuenta eliminada con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;