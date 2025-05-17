const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const Especie = sequelize.define(
    "Especie",
    {
      ESP_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "ESP_ID",
      },
      ESP_NOMBRE: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: "ESP_NOMBRE",
      },
      ESP_DESCRIPCION: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "ESP_DESCRIPCION",
      },
      ESP_ESTADO: {
        type: DataTypes.ENUM("activo", "inactivo"),
        default: "activo",
        field: "ESP_ESTADO",
      },
      ESP_CREADO_POR: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ESP_CREADO_POR",
      },
    },
    {
      tableName: "especie",
      timestamps: true, // Habilita timestamps
      createdAt: "ESP_FECHACAMBIO", // Mapea createdAt a ESP_FECHACAMBIO
      updatedAt: "ESP_FECHACAMBIO", // Mapea updatedAt al mismo campo
      underscored: false, // Desactiva snake_case
      freezeTableName: true, // Evita pluralización
    }
  );
  return Especie;
};
