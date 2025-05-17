const {DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    const Cita = sequelize.define("Cita",{
        CIT_ID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            field: "CIT_ID"
        },
        MACT_ID:{
            type:DataTypes.INTEGER,
            allowNull: false,
            field:"MACT_ID"
        },
        CIT_FECHACITA:{
            type:DataTypes.DATEONLY,
            allowNull:false,
            field:"CIT_FECHACITA"
        },
        CIT_HORA:{
            type:DataTypes.TIME,
            allowNull:false,
            field:"CIT_HORA"
        },
        CIT_DURACION:{
            type:DataTypes.INTEGER,
            defaultValue:30,
            field: "CIT_DURACION"
        },
        CIT_TIPO:{
            type: DataTypes.ENUM('consulta', 'vacunación', 'emergencia', 'cirugía', 'estética', 'otros'),
            defaultValue:'consulta',
            field:"CIT_TIPO"
        },
        CIT_ESTADO:{
            type: DataTypes.ENUM('Pendiente','Atendida','Cancelada'),
            defaultValue:'Pendiente',
            field:"CIT_ESTADO"
        },
        CIT_MOTIVOCITA:{
            type: DataTypes.TEXT,
            field: "CIT_MOTIVOCITA"
        },
        CIT_OBSERVACIONMEDICA:{
            type: DataTypes.TEXT,
            field: "CIT_OBSERVACIONMEDICA"
        },
        USUA_IDVETERINARIO:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "USUA_IDVETERINARIO"
        },
        CIT_CREADO_POR:{
            type: DataTypes.INTEGER,
            field:"CIT_CREADO_POR"
        }
    },{
        tableName: "citas",
        timestamps: true,
        createdAt: "CIT_FECHACAMBIO",
        updatedAt: "CIT_FECHACAMBIO",
        underscored: false
    });
    return Cita;
}