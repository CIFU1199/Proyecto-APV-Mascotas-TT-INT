const {
  Cita,
  Mascota,
  Usuario,
  Especie,
  HistorialMedico,
  sequelize,
} = require("../models");
const { calcularEdad } = require("../utils/helpers");
const {Op} = require("sequelize");



exports.obtenerCitasCompletas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Mascota,
          as: "Mascota",
          attributes: ["MACT_NOMBRE", "MACT_FECHA_NACIMIENTO", "MACT_RAZA", "MACT_PESO", "MACT_COLOR", "MACT_FOTO"],
          include: [
            {
              model: Especie,
              as: "Especie",
              attributes: ["ESP_NOMBRE"],
            },
            {
              model: Usuario,
              as: "Dueño",
              attributes: ["USUA_NOMBRES"],
              required: false
            },
          ],
        },
        {
          model: Usuario,
          as: "Veterinario",
          attributes: ["USUA_NOMBRES"],
          required: false
        },
      ],
      attributes: ["CIT_ID", "CIT_FECHACITA", "CIT_HORA", "CIT_TIPO", "CIT_ESTADO", "CIT_MOTIVOCITA"],
      order: [["CIT_FECHACITA", "ASC"], ["CIT_HORA", "ASC"]],
    });

    const response = citas.map((cita) => {
      // Usamos la función calcularEdad aquí
      const edadMascota = calcularEdad(cita.Mascota?.MACT_FECHA_NACIMIENTO);

      return {
        id: cita.CIT_ID,
        mascota: {
          nombre: cita.Mascota?.MACT_NOMBRE || 'Sin nombre',
          especie: cita.Mascota?.Especie?.ESP_NOMBRE || 'Sin especie',
          edad: edadMascota, // Usamos el resultado directamente
          raza: cita.Mascota?.MACT_RAZA || 'Desconocida',
          peso: cita.Mascota?.MACT_PESO || 0,
          color: cita.Mascota?.MACT_COLOR || 'Desconocido',
          foto: cita.Mascota?.MACT_FOTO || null,
        },
        dueño: cita.Mascota?.Dueño?.USUA_NOMBRES || 'Dueño no asignado',
        veterinario: cita.Veterinario?.USUA_NOMBRES || 'Veterinario no asignado',
        fecha: cita.CIT_FECHACITA,
        hora: cita.CIT_HORA,
        tipo: cita.CIT_TIPO,
        estado: cita.CIT_ESTADO,
        motivo: cita.CIT_MOTIVOCITA || 'Sin motivo especificado',
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Error en Obtener las Citas del Usuario: ", error);
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

//Filtrar Citas
exports.filtrarCitas = async (req, res) => {
  try {
    const { fecha, estado, tipo, veterinarioId, mascotaId } = req.query;
    const where = {};
    
    // Manejo especial para fechas
    if (fecha) {
      where.CIT_FECHACITA = {
        [Op.between]: [
          new Date(fecha + 'T00:00:00'), // Inicio del día
          new Date(fecha + 'T23:59:59')  // Fin del día
        ]
      };
    }
    
    if (estado) where.CIT_ESTADO = estado;
    if (tipo) where.CIT_TIPO = tipo;
    if (veterinarioId) where.USUA_IDVETERINARIO = veterinarioId;
    if (mascotaId) where.MACT_ID = mascotaId;

    const citas = await Cita.findAll({
      where,
      include: [
        {
          model: Mascota,
          as: "Mascota",
          attributes: ["MACT_NOMBRE"],
          required: false // IMPORTANTE para LEFT JOIN
        },
        {
          model: Usuario,
          as: "Veterinario",
          attributes: ["USUA_NOMBRES"],
          required: false // IMPORTANTE para LEFT JOIN
        }
      ],
      order: [
        ["CIT_FECHACITA", "ASC"],
        ["CIT_HORA", "ASC"] // Añadí el orden explícito
      ]
    });

    // Formatear respuesta con protección contra null
    const response = citas.map(cita => ({
      id: cita.CIT_ID,
      mascota: {
        nombre: cita.Mascota?.MACT_NOMBRE || 'Sin nombre'
      },
      veterinario: {
        nombre: cita.Veterinario?.USUA_NOMBRES || 'Sin asignar'
      },
      fecha: cita.CIT_FECHACITA,
      hora: cita.CIT_HORA,
      tipo: cita.CIT_TIPO,
      estado: cita.CIT_ESTADO
    }));

    res.json(response);
  } catch (error) {
    console.error("Error al filtrar citas:", error);
    res.status(500).json({ 
      error: "Error al filtrar citas",
      detalle: error.message
    });
  }
};

//Reprogramar Cita 
exports.reprogramarCita = async (req, res)=>{
  try{
    const {id} = req.params;
    const {nuevaFecha, nuevaHora, motivo} = req.body;
    if(!nuevaFecha || !nuevaHora){
      return res.status(400).json({ error: "Fecha y Hora son requeridas"});
    }
    const cita = await Cita.findByPk(id);
    if(!cita) return res.status(404).json({error: "Cita no encontrada"});

    if(cita.CIT_ESTADO === "Atendida" || cita.CIT_ESTADO === "Cancelada"){
      return res.status(400).json({error:" No se puede reprogramar una cita atendida o cancelada"});
    }

    await Cita.update({
      CIT_FECHACITA:nuevaFecha,
      CIT_HORA: nuevaHora,
      CIT_MOTIVOCITA: motivo || cita.CIT_MOTIVOCITA,
      CIT_FECHACAMBIO: new Date(),
    },{where:{CIT_ID:id}}
  );
  res.json({mensaje: "Cita reprogramada exitosamente"});
  }catch(error){
    console.error("Error interno del servidor:" , error )
    res.status(500).json({error: "Error al reprogramar", detalle: error.message});
  }
}

//Obtener Cita por mascota 
exports.obtenerCitasPorMacota = async (req, res)=>{
  try{
    const {mascotaId} = req.params;
    const citas = await Cita.findAll({
      where:{MACT_ID: mascotaId},
      include:[
        {model: Usuario, as: "Veterinario", attributes:["USUA_NOMBRES"]},
      ],
      order:[["CIT_FECHACITA","DESC"]]// MUESTRA EL MAS RECIENTE PRIMERO
    });
    res.json(citas);
  }catch(error){
    console.error("Error interno del servidor:" , error )
    res.status(500).json({error: "Error al obtener citas", detalle: error.message});
  }
}

//Cancelar cita 
exports.cancelarCita = async (req, res) => {
  try {
    const { id } = req.params; //ID de la cita
    const { observacion } = req.body; // Observacion medica de la cancelacion
    const usuarioId = req.user.id; // ID del Veterinario / admin con sesión iniciada

    // Validaciones Basicas

    if (!observacion || observacion.trim() === "") {
      return res.status(400).json({
        error: "La observacion de cancelacion es requerida",
      });
    }
    //Buscar la cita Existente
    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({ error: "Cita No encontrada" });
    }

    // Verificar si ya está cancelada
    if (cita.CIT_ESTADO === "Cancelada") {
      return res.status(400).json({
        error: "La cita ya está cancelada",
        citaActual: cita,
      });
    }

    // Restringir Cambiar de estado si esta atendida
    if (cita.CIT_ESTADO === "Atendida") {
      return res.status(400).json({
        error: "No se puede Cancelar una cita ya atendida",
        citaActual: cita,
      });
    }

    //Actualizar la cita

    const [updated] = await Cita.update(
      {
        CIT_ESTADO: "Cancelada",
        CIT_OBSERVACIONMEDICA: observacion,
        USUA_IDVETERINARIO: usuarioId, //Actualizar con el usuario de la sesíon
        CIT_FECHACAMBIO: new Date(),
      },
      {
        where: { CIT_ID: id },
      }
    );

    if (updated === 0) {
      return res.status(400).json({ error: "No se pudo Cancelar la cita" });
    }
    //Ontener la cita Actualizada para la respuesta
    const citaActualizada = await Cita.findByPk(id, {
      include: [
        {
          model: Mascota,
          as: "Mascota",
          attributes: ["MACT_NOMBRE"],
          include: [
            {
              model: Usuario,
              as: "Dueño",
              attributes: ["USUA_NOMBRES", "USUA_CORREO"],
            },
          ],
        },
        {
          model: Usuario,
          as: "Veterinario",
          attributes: ["USUA_NOMBRES", "USUA_CORREO"],
        },
      ],
    });
    res.json({
      mensaje: "Cita cancelada exitosamente",
      detalles:
        'El estado se actualizo a "Cancelada" y se registro el veterinario responsable',
      cita: citaActualizada,
    });
  } catch (error) {
    console.error("Error en Cancelar la Cita: ", error);
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

exports.atenderCita = async (req, res) => {
  // Validar que el body existe
  if (!req.body) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud no puede estar vacío"
    });
  }

  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { observacion } = req.body || {}; // Fallback a objeto vacío
    const usuarioId = req.user.id;

    // Validación mejorada
    if (!observacion || typeof observacion !== 'string' || observacion.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        error: "Se requiere una observación médica válida para cambiar el estado",
        detalles: "La observación debe ser un texto no vacío"
      });
    }

    // Buscar y actualizar cita
    const cita = await Cita.findOne({
      where: { CIT_ID: id },
      transaction,
    });

    if (!cita) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: "Cita no encontrada",
        detalles: `No existe cita con ID ${id}`
      });
    }

    if (cita.CIT_ESTADO === "Atendida") {
      await transaction.rollback();
      return res.status(400).json({ 
        error: "La cita ya fue atendida",
        detalles: `La cita ${id} ya está en estado 'Atendida'`
      });
    }

    // Actualizar cita
    await Cita.update(
      {
        CIT_ESTADO: "Atendida",
        CIT_OBSERVACIONMEDICA: observacion,
        USUA_IDVETERINARIO: usuarioId,
        CIT_FECHACAMBIO: new Date(),
      },
      {
        where: { CIT_ID: id },
        transaction,
      }
    );
    // Antes de crear el historial
    const tiposValidos = ['consulta', 'vacunación', 'emergencia', 'cirugía', 'estética', 'otros'];
    if (!tiposValidos.includes(cita.CIT_TIPO)) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Tipo de cita no válido para historial médico",
        tipoRecibido: cita.CIT_TIPO,
        tiposAceptados: tiposValidos
      });
    }

    // Crear registro en historial médico
    await HistorialMedico.create(
      {
        MACT_ID: cita.MACT_ID,
        CIT_ID: cita.CIT_ID, // Agregamos el id de la cita
        HM_FECHA: cita.CIT_FECHACITA,
        HM_TIPO: cita.CIT_TIPO,
        HM_DESCRIPCION: cita.CIT_MOTIVOCITA || "Sin motivo especificado",
        HM_DETALLES: `Cita atendida - Duración: ${cita.CIT_DURACION || 'No registrada'} mins`,
        HM_OBSERVACIONES: observacion,
        USUA_IDVETERINARIO: usuarioId,
        HM_FECHACAMBIO: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    const citaActualizada = await Cita.findByPk(id, {
      include: [
        {
          model: Mascota,
          as: 'Mascota',
          attributes: ['MACT_NOMBRE']
        },
        {
          model: Usuario,
          as: 'Veterinario',
          attributes: ['USUA_NOMBRES']
        }
      ]
    });

    res.json({
      success: true,
      mensaje: 'Cita marcada como atendida exitosamente',
      cita: {
        id: citaActualizada.CIT_ID,
        estado: citaActualizada.CIT_ESTADO,
        observacion: citaActualizada.CIT_OBSERVACIONMEDICA,
        mascota: citaActualizada.Mascota.MACT_NOMBRE,
        veterinario: citaActualizada.Veterinario.USUA_NOMBRES,
        fecha: citaActualizada.CIT_FECHACITA,
        hora: citaActualizada.CIT_HORA,
        tipo: citaActualizada.CIT_TIPO
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al atender cita:', error);
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

exports.obtenerDetallesCita = async (req, res) =>{
  try{
    const {id} = req.params;

    const cita = await Cita.findByPk(id, {
      include:[
        {
          model: Mascota,
          as: "Mascota",
          attributes: [
            "MACT_NOMBRE",
            "MACT_FECHA_NACIMIENTO",
            "MACT_SEXO",
            "MACT_RAZA",
            "MACT_PESO",
            "MACT_COLOR",
            "MACT_FOTO"
          ],
          include:[
            {
              model:Especie,
              as: "Especie",
              attributes:["ESP_NOMBRE"]
            }
          ]
        },
        {
          model: Usuario,
          as: "Veterinario",
          attributes:["USUA_NOMBRES"]
        }
      ],
      attributes:[
        "CIT_ID",
        "CIT_FECHACITA",
        "CIT_HORA",
        "CIT_TIPO",
        "CIT_ESTADO",
        "CIT_MOTIVOCITA",
        "CIT_OBSERVACIONMEDICA"
      ]
    });
    if (!cita){
      return res.status(404).json({error: "Cita no Encontrada"});
    }

    // Calcular la edad de la mascota 
    const edadMascota = cita.Mascota?.MACT_FECHA_NACIMIENTO
      ? calcularEdad(cita.Mascota.MACT_FECHA_NACIMIENTO)
      : 'Desconocida';
    
      // Formateamos los datos de respuesta para el modal 
      const response ={
        id: cita.CIT_ID,
        mascota: {
          nombre: cita.Mascota?.MACT_NOMBRE || 'Sin nombre',
          especie: cita.Mascota?.Especie?.ESP_NOMBRE || 'Sin especie',
          sexo: cita.Mascota?.MACT_SEXO || 'Desconocido',
          raza: cita.Mascota?.MACT_RAZA || 'Desconocida',
          color: cita.Mascota?.MACT_COLOR || 'Desconocido',
          peso: cita.Mascota?.MACT_PESO || null,
          foto: cita.Mascota?.MACT_FOTO || null
        },
        fecha: cita.CIT_FECHACITA,
        hora: cita.CIT_HORA,
        tipo: cita.CIT_TIPO,
        estado: cita.CIT_ESTADO,
        motivo: cita.CIT_MOTIVOCITA || 'Sin Motivo especificado',
        observacionMedica: cita.CIT_OBSERVACIONMEDICA || null,
        veterinario: {
          nombre: cita.Veterinario?.USUA_NOMBRES || 'No asignado'
        }
      };
      res.json(response);
  }catch(error){
    console.error("Error al obtener la cita: ", error);
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message
    })
  }
}