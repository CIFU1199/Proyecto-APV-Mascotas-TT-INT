const sequelize = require('../config/db');
const Especie = require('./Especie')(sequelize);
const Mascota = require('./Mascota')(sequelize);

// Relaciones entre modelos (si las hay)
Mascota.belongsTo(Especie, { foreignKey: 'ESP_ID' });


module.exports = {
    Especie,
    Mascota
}