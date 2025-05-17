const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");


module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      USUA_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      USUA_DOCUMENTO: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      USUA_NOMBRES: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      USUA_CORREO: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      USUA_PASSWORD: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USUA_TELEFONO: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      USUA_DIRECCION: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ROL_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      USUA_ESTADO: {
        type: DataTypes.ENUM("activo", "inactivo"),
        defaultValue: "activo",
      },
    },
    {
      tableName: "usuarios", // Nombre exacto de la tabla en MySQL
      underscored: false, // Desactiva la conversión automática a snake_case
      freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
      timestamps: false, // Si no usas createdAt/updatedAt
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.USUA_PASSWORD) {
            const salt = await bcrypt.genSalt(10);
            usuario.USUA_PASSWORD = await bcrypt.hash(
              usuario.USUA_PASSWORD,
              salt
            );
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed("USUA_PASSWORD")) {
            const salt = await bcrypt.genSalt(10);
            usuario.USUA_PASSWORD = await bcrypt.hash(
              usuario.USUA_PASSWORD,
              salt
            );
          }
        },
      },
    }
  );

  Usuario.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.USUA_PASSWORD);
  };
  return Usuario;
};
