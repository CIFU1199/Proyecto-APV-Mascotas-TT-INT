const sequelize = require('../config/db');

// Debug: Verifica Sequelize
console.log('¿Sequelize tiene Model?', !!sequelize.Model); // Debe ser true

// Inicializa modelos
const Especie = require('./Especie')(sequelize);
const Mascota = require('./Mascota')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const Cita = require('./Cita')(sequelize);
const HistorialMedico = require('./HistorialMedico')(sequelize);

// 3. Configurar asociaciones
function configurarAsociaciones() {
  // Asociaciones de Mascota
  Mascota.belongsTo(Especie, { foreignKey: 'ESP_ID', as: 'Especie' });
  Mascota.belongsTo(Usuario, { foreignKey: 'USUA_ID', as: 'Dueño' });
  
  // Asociaciones de Cita
  Cita.belongsTo(Mascota, { foreignKey: 'MACT_ID', as: 'Mascota' });
  Cita.belongsTo(Usuario, { foreignKey: 'USUA_IDVETERINARIO', as: 'Veterinario' });

// Asociaciones de Historial Medico
  HistorialMedico.belongsTo(Mascota, { foreignKey: 'MACT_ID', as: 'Mascota' });
  HistorialMedico.belongsTo(Usuario, { foreignKey: 'USUA_IDVETERINARIO', as: 'VeterinarioHistorial' }); // alias diferente
  HistorialMedico.belongsTo(Cita, { foreignKey: 'CIT_ID', as: 'Cita' });


  // Asociaciones inversas

  Especie.hasMany(Mascota, { foreignKey: 'ESP_ID' });
  Usuario.hasMany(Mascota, { foreignKey: 'USUA_ID' });
  Usuario.hasMany(Cita, { foreignKey: 'USUA_IDVETERINARIO' });
  Mascota.hasMany(Cita, { foreignKey: 'MACT_ID' });

  Usuario.hasMany(HistorialMedico, { foreignKey: 'USUA_IDVETERINARIO', as: 'HistorialesComoVeterinario' });
  Mascota.hasMany(HistorialMedico, { foreignKey: 'MACT_ID', as: 'HistorialesMedicos' });
  Cita.hasOne(HistorialMedico, { foreignKey: 'CIT_ID', sourceKey: 'CIT_ID', as: 'HistorialMedico' });// Cambiado a hasOne

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



module.exports = {
  sequelize,
  Especie,
  Mascota,
  Usuario,
  Cita,
  HistorialMedico
};