const {
  Cita,
  Mascota,
  Usuario
} = require("../models");

exports.obtenerEstadisticas = async(req, res)=>{
    try{
        const[totalUsuarios, totalMascotas, totalCitas] = await Promise.all([
            Usuario.count(),
            Mascota.count(),
            Cita.count(),
        ]);

        res.status(200).json({
            success: true,
            data:{
                usuarios: totalUsuarios,
                mascotas: totalMascotas,
                citas: totalCitas
            }
        });

    }catch(error){
        console.error('Error interno del servidor:' , error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadisticas',
            error: error.message
        });
    }
}