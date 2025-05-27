const {
  Cita,
  Mascota,
  Usuario,
  Especie,
  HistorialMedico,
  sequelize,
} = require("../models");

//obtiene el historial de las mascotas 

exports.obtenerHistorialMascota = async (req, res) => {
    try{
        const { mascotaId } = req.params;
        const historial = await HistorialMedico.findAll({
            where:{MACT_ID: mascotaId},
            include:[
                {model: Usuario, as:"Veterinario", attributes: ["USUA_NOMBRES"]},
            ],
            ORDER:[["HM_FECHA","DESC"]],
        });
        res.json(historial);
    }catch(error){
        console.error("Error interno del servidor: ", error);
        res.status(500).json({ error: "Error al obtener historial", detalle: error.message });
    }
}

// Crear un registro manual al historial
exports.crearRegistroHistorial = async (req, res) => {
    try {
        const {mascotaId, tipo, descripcion, detalles, observacion} = req.body;
        const usuarioId = req.user.id;

        const nuevoRegistro = await HistorialMedico.create({
            MACT_ID: mascotaId,
            HM_FECHA: new Date(),
            HM_TIPO: tipo,
            HM_DESCRIPCION: descripcion,
            HM_DETALLES: detalles,
            HM_OBSERVACIONES: observaciones,
             USUA_IDVETERINARIO: usuarioId,
        });

        res.status(201).json(nuevoRegistro);
    }catch(error){
        console.error("Error interno del servidor: ", error);
        res.status(500).json({ error: "Error al obtener historial", detalle: error.message });
    }
}


//Filtrar el historial por tipo 

exports.filtrarHistorialPorTipo = async (req, res) => {
    try{
        const { mascotaId , tipo} = req.params;
        const historial = await HistorialMedico.findAll({
            where: {MACT_ID: mascotaId, HM_TIPO: tipo},
            order: [["HM_FECHA","DESC"]],
        });

        res.json(historial);
    }catch (error){
        console.error("Error interno del servidor: ", error);
        res.status(500).json({ error: "Error al obtener historial", detalle: error.message });
    }
}