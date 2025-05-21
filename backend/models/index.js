const sequelize = require('../config/db');

// Debug: Verifica Sequelize
console.log('¿Sequelize tiene Model?', !!sequelize.Model); // Debe ser true

// Inicializa modelos
const Especie = require('./Especie')(sequelize);
const Mascota = require('./Mascota')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const Cita = require('./Cita')(sequelize);

// 3. Configurar asociaciones
function configurarAsociaciones() {
  // Asociaciones de Mascota
  Mascota.belongsTo(Especie, { foreignKey: 'ESP_ID', as: 'Especie' });
  Mascota.belongsTo(Usuario, { foreignKey: 'USUA_ID', as: 'Dueño' });
  
  // Asociaciones de Cita
  Cita.belongsTo(Mascota, { foreignKey: 'MACT_ID', as: 'Mascota' });
  Cita.belongsTo(Usuario, { foreignKey: 'USUA_IDVETERINARIO', as: 'Veterinario' });
  
  // Asociaciones inversas
  Especie.hasMany(Mascota, { foreignKey: 'ESP_ID' });
  Usuario.hasMany(Mascota, { foreignKey: 'USUA_ID' });
  Usuario.hasMany(Cita, { foreignKey: 'USUA_IDVETERINARIO' });
  Mascota.hasMany(Cita, { foreignKey: 'MACT_ID' });
}

// 4. Ejecutar configuración
configurarAsociaciones();

// 4. Validación de modelos
console.log('Modelos verificados:', {
  Especie: !!Especie && !!Especie.associate,
  Mascota: !!Mascota && !!Mascota.associate,
  Usuario: !!Usuario && !!Usuario.associate,
  Cita: !!Cita && !!Cita.associate
});


/*
// Establece relaciones
Mascota.belongsTo(Especie, { foreignKey: 'ESP_ID' });
Mascota.belongsTo(Usuario, { foreignKey: 'USUA_ID' });
Cita.belongsTo(Mascota, { foreignKey: 'MACT_ID' });
Cita.belongsTo(Usuario, { foreignKey: 'USUA_IDVETERINARIO', as: 'Veterinario'});
*/
// Sincronización opcional (comenta temporalmente para pruebas)
// sequelize.sync({ alter: true }).then(() => console.log('Modelos sincronizados'));

module.exports = {
  sequelize,
  Especie,
  Mascota,
  Usuario,
  Cita
};