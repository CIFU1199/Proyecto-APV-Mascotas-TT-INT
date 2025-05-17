const sequelize = require('./config/db');
const Usuario = require('./models/Usuario');
const Especie = require('./models/Especie');

async function syncDatabase(){
    try{
        await sequelize.authenticate();
        console.log('Conexion con BD establecida.');

        await sequelize.sync({force:false});
        console.log('Modelos sincronizados con la DB.')
    }catch(error){
        console.error('Error al sincronizar: ', error );
    }
}

syncDatabase();