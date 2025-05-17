const { Especie, Mascota } = require('../models'); // Importa desde models/index.js
const {validationResult}= require('express-validator');


exports.registrarMascota  = async(req, res)=>{
    try{
        //VALIDAMOS LOS DATOS DE ENTRADA
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const USUA_ID= req.user.id;

        const { 
            MACT_NOMBRE,
            ESP_ID,
            MACT_SEXO,
            MACT_FECHA_NACIMIENTO,
            MACT_RAZA,
            MACT_PESO,
            MACT_COLOR,
            MACT_FOTO
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