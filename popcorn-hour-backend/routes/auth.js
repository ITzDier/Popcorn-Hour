const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// FUNCIÓN PARA GENERAR EL TOKEN JWT
function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role // Usar campo 'role'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

// Ruta de registro
router.post('/register', async (req, res) => {
    const { nombreUsuario, email, password, role } = req.body;

    try {
        // Verifica si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe.' });
        }

        // Validar que el role sea permitido
        const validRoles = ['estandar', 'moderador'];
        const userRole = validRoles.includes(role) ? role : 'estandar';

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        user = new User({
            nombreUsuario,
            email,
            password: hashedPassword,
            role: userRole,
            favoritos: [],
            auth2faSecret: speakeasy.generateSecret({ length: 20 }).base32,
            is2faEnabled: false
        });

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        console.log('Usuario logueado:', {
            id: user._id,
            email: user.email,
            username: user.nombreUsuario,
            role: user.role
        });

        const token = generateToken(user);

        res.json({
            token,
            user: {
                _id: user._id,
                nombreUsuario: user.nombreUsuario,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Solicitar restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `http://tu-frontend.com/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

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

// Restablecer contraseña con el token
router.post('/reset-password/:token', async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { password } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Token de restablecimiento inválido o expirado.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.json({ msg: 'Contraseña restablecida exitosamente.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// Obtener datos del usuario autenticado
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            nombreUsuario: user.nombreUsuario,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener el usuario' });
    }
});

// Eliminar la cuenta del usuario autenticado
router.delete('/', auth, async (req, res) => {
    try {
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