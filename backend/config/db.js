const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,{
        host: process.env.DB_HOST,
        dialect:'mysql',
        logging: false,
        define:{
            timestamps:true,
            freezeTableName: true
        }
    }
);

// Verifica conexión al iniciar
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a BD establecida'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = sequelize;