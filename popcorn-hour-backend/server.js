const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
app.use(cors());

dotenv.config();

const app = express();

// Agrega esto para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Conectar a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Conectado...');
    } catch (err) {
        console.error('Error de conexión a la base de datos:', err.message);
        process.exit(1);
    }
};

connectDB(); // Llamada para iniciar la conexión

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);

const interactionsRoutes = require('./routes/interactions');
app.use('/api/interactions', interactionsRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API de PopcornHour en funcionamiento.');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});