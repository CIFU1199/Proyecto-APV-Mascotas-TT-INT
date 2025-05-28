const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db'); 

// Configuración de CORS
const corsOptions = {
  origin: process.env.FE_ORIGIN, // Cambia esto si tu frontend se hospeda en otro lado
  credentials: true
};



//Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Conexión a la base de datos
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con BD establecida.');

    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados con la DB.');
  } catch (error) {
    console.error('Error al sincronizar:', error);
  }
}

initializeDatabase();



//Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/especie',require ('./routes/especie.routes'));
app.use('/api/mascotas', require('./routes/mascota.routes'));
app.use('/api/cita', require('./routes/cita.routes'));
app.use('/api/estadisticas', require('./routes/estadisticas.routes'));

const PORT = process.env.PORT;

app.listen(PORT,() =>{
    console.log(`Servidor en ${process.env.BE_ORIGIN}:${PORT}` );
})