const { Especie, Mascota } = require('../models'); // Importa desde models/index.js
const {validationResult}= require('express-validator');
const { calcularEdad } = require('../utils/helpers'); 
const upload = require('../middlewares/uploadMascota');

exports.registrarMascota  = async(req, res)=>{
    try{
        //VALIDAMOS LOS DATOS DE ENTRADA
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const USUA_ID= req.user.id;
        const MACT_FOTO = req.file ? `/upload/mascotas/${req.file.filename}`: null;

        const { 
            MACT_NOMBRE,
            ESP_ID,
            MACT_SEXO,
            MACT_FECHA_NACIMIENTO,
            MACT_RAZA,
            MACT_PESO,
            MACT_COLOR
        } = req.body;

        const especie = await Especie.findByPk(ESP_ID);
        if(!especie){
            return res.status(400).json({error: "La especie no existe"})
        }

        //CREA LA MASCOTA 

        const nuevaMascota = await Mascota.create({
            USUA_ID, // <- trae el id del token
            MACT_NOMBRE,
            ESP_ID,
            MACT_SEXO,
            MACT_FECHA_NACIMIENTO,
            MACT_RAZA,
            MACT_PESO,
            MACT_COLOR,
            MACT_FOTO,
            MACT_CREADO_POR: USUA_ID

        })
        
        res.status(201).json({
            messaje: 'Mascota registrada exitosamente',
            mascota: nuevaMascota
        });
        
    }catch(error){
        console.error('Error al registrar mascota:', error);
        //errores de sequelize
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({
                error: 'Error de clave foránea. Verifica que los IDs relacionados existan.'
            })
        }

        res.status(500).json({
            mesaje: 'Error interno del servidor',
            error: error.messaje
        })
    }
} 

exports.obtenerMisMascotas = async (req, res) => {
  try{
    const mascotas = await Mascota.findAll({
      where:{USUA_ID: req.user.id}, //filtra por el id del usuario logueado
      attributes:[
        'MACT_ID',
        'MACT_NOMBRE',
        'MACT_SEXO',
        'MACT_FECHA_NACIMIENTO',
        'MACT_RAZA',
        'MACT_PESO',
        'MACT_COLOR',
        'MACT_FOTO'
      ],
      include:[{
        model: Especie,
        as:'Especie',
        attributes:['ESP_NOMBRE']
      }],
      order:[['MACT_NOMBRE','ASC']]
    })

    //Calcula la edad segun la fecha de nacimiento
    const mascotasConEdad = mascotas.map(mascota => {
      const edad = calcularEdad(mascota.MACT_FECHA_NACIMIENTO);
      return { ...mascota.toJSON(), edad};
    });

    res.json(mascotasConEdad);
  }catch(error){
    console.log('Error al obtener mascota: ', error);
    res.status(500).json({
      error: 'Error interno del Servidor',
      detalle: error.message
    });
  }
};



//Funcion Auxiliar para calcular edad
/*
function calcularEdad(fechaNacimiento){
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if(mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())){
    edad--;
  }
  return edad;
}
*/