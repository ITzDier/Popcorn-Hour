const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'popcornhoursecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Conectado...');
    } catch (err) {
        console.error('Error de conexión a la base de datos:', err.message);
        process.exit(1);
    }
};
connectDB();

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);

const interactionsRoutes = require('./routes/interactions');
app.use('/api/interactions', interactionsRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de PopcornHour en funcionamiento.');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});