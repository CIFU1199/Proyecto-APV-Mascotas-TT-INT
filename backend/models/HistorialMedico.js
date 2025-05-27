const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const HistorialMedico = sequelize.define(
    "HistorialMedico",
    {
      HM_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "HM_ID",
      },
      MACT_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "MACT_ID",
      },
      CIT_ID: {
        type: DataTypes.INTEGER,
        field: "CIT_ID",
      },
      HM_FECHA: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "HM_FECHA",
      },
      HM_TIPO: {
        type: DataTypes.ENUM(
          'consulta', 'vacunación', 'emergencia', 'cirugía', 'estética', 'otros'
        ),
        allowNull: false,
        field: "HM_TIPO",
      },
      HM_DESCRIPCION: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "HM_DESCRIPCION",
      },
      HM_OBSERVACIONES: {
        type: DataTypes.TEXT,
        field: "HM_OBSERVACIONES",
      },
      USUA_IDVETERINARIO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "USUA_IDVETERINARIO",
      },
      HM_FECHACAMBIO: {
        type: DataTypes.DATE,
        defaultValues: DataTypes.NOW,
        field: "HM_FECHACAMBIO",
      },
    },
    {
      tableName: "historial_medico",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      indexes: [
        {
          name: "fk_historial_mascota",
          fields: ["MACT_ID"],
        },
        {
          name: "fk_historial_veterinario",
          fields: ["USUA_IDVETERINARIO"],
        },
      ],
    }
  );
  return HistorialMedico;
};
