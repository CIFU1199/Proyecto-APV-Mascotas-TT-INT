const sequelize = require('../config/db');

// Debug: Verifica Sequelize
console.log('¿Sequelize tiene Model?', !!sequelize.Model); // Debe ser true

// Inicializa modelos
const Especie = require('./Especie')(sequelize);
const Mascota = require('./Mascota')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const Cita = require('./Cita')(sequelize);

// Debug: Verifica modelos
console.log('Modelos cargados:', {
  Especie: !!Especie,
  Mascota: !!Mascota,
  Usuario: !!Usuario,
  Cita: !!Cita
});

// Establece relaciones
Mascota.belongsTo(Especie, { foreignKey: 'ESP_ID' });
Cita.belongsTo(Mascota, { foreignKey: 'MACT_ID' });
Cita.belongsTo(Usuario, { 
  foreignKey: 'USUA_IDVETERINARIO',
  as: 'Veterinario'
});

// Sincronización opcional (comenta temporalmente para pruebas)
// sequelize.sync({ alter: true }).then(() => console.log('Modelos sincronizados'));

module.exports = {
  sequelize,
  Especie,
  Mascota,
  Usuario,
  Cita
};