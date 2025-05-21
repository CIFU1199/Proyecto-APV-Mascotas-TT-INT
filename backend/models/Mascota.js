const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Mascota = sequelize.define(
    "Mascota",
    {
      MACT_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "MACT_ID", // NOMBRE DE LA COLUMNA EN LA BASE DE DATOS
      },
      USUA_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "USUA_ID",
      },
      MACT_NOMBRE: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "MACT_NOMBRE",
      },
      ESP_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "ESP_ID",
      },
      MACT_SEXO: {
        type: DataTypes.ENUM("Macho", "Hembra", "Desconocido"),
        defaultValue: "Desconocido",
        field: "MACT_SEXO",
      },
      MACT_FECHA_NACIMIENTO: {
        type: DataTypes.DATE,
        field: "MACT_FECHA_NACIMIENTO",
      },
      MACT_RAZA: {
        type: DataTypes.STRING(200),
        field: "MACT_RAZA",
      },
      MACT_PESO: {
        type: DataTypes.DECIMAL(5, 2),
        field: "MACT_PESO",
      },
      MACT_COLOR: {
        type: DataTypes.STRING(100),
        field: "MACT_COLOR",
      },
      MACT_FOTO: {
        type: DataTypes.STRING(255),
        field: "MACT_FOTO",
      },
      MACT_CREADO_POR: {
        type: DataTypes.INTEGER,
        field: "MACT_CREADO_POR",
      },
    },
    {
      tableName: "mascotas",
      timestamps: false,
      underscored: false, //EVita que sequelize trasforme los nombres
    }
  );
  
  return Mascota;
};
