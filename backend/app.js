const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db'); 


//Middlewares
app.use(cors());
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
/*
app.use('/api/mascotas', require('./routes/mascotas'));
*/
const PORT = process.env.PORT || 4000;

app.listen(PORT,() =>{
    console.log(`Servidor en http://localhost:${PORT}` );
})