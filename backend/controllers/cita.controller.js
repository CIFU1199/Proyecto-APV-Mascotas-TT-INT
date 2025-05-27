const {
  Cita,
  Mascota,
  Usuario,
  Especie,
  HistorialMedico,
  sequelize,
} = require("../models");
const { validationResult } = require("express-validator");
const { calcularEdad } = require("../utils/helpers");

// USUARIO CREA LA CITA 
exports.registrarCita = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      MACT_ID,
      CIT_FECHACITA,
      CIT_HORA,
      CIT_DURACION,
      CIT_TIPO,
      CIT_MOTIVOCITA
    } = req.body;

    // Validar que exista la mascota
    const mascota = await Mascota.findByPk(MACT_ID, { transaction });
    if (!mascota) {
      await transaction.rollback();
      return res.status(404).json({ error: "La mascota no existe" });
    }

    // Validar disponibilidad de horario (sin verificar veterinario)
    const citaExistente = await Cita.findOne({
      where: {
        CIT_FECHACITA,
        CIT_HORA
      },
      transaction,
    });
    
    if (citaExistente) {
      await transaction.rollback();
      return res.status(409).json({ error: "Ya existe una cita en ese horario" });
    }

    // Validar horario laboral
    const horaCita = new Date(`1970-01-01T${CIT_HORA}`);
    const horaInicio = new Date(`1970-01-01T08:00:00`);
    const horaFin = new Date(`1970-01-01T17:00:00`);

    if (horaCita < horaInicio || horaCita > horaFin) {
      await transaction.rollback();
      return res.status(400).json({ error: "El horario debe ser entre 8:00 AM y 5:00 PM" });
    }

    // Crear la Cita
    const nuevaCita = await Cita.create(
      {
        MACT_ID,
        CIT_FECHACITA,
        CIT_HORA,
        CIT_DURACION: CIT_DURACION || 30,
        CIT_TIPO: CIT_TIPO || "consulta",
        CIT_ESTADO: "Pendiente",
        CIT_MOTIVOCITA,
        CIT_CREADO_POR: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      mensaje: "Cita registrada exitosamente",
      cita: nuevaCita,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al registrar cita: ", error);
    
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Error de referencia. Verifica los IDs proporcionados.",
      });
    }

    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

//OBTIENE LAS CITAS CREADAS POR EL USUARIO 
exports.obtenerCitaUsuario = async (req, res) => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    // 1. Obtener las mascotas del usuario
    const mascotas = await Mascota.findAll({
      where: { USUA_ID: req.user.id },
      attributes: ["MACT_ID"], // Solo necesitamos los IDs
    });

    // Extraer solo los IDs de las mascotas
    const mascotaIds = mascotas.map((m) => m.MACT_ID);

    // 2. Obtener citas de esas mascotas
    const citas = await Cita.findAll({
      where: { MACT_ID: mascotaIds },
      include: [
        {
          model: Mascota,
          as: "Mascota",
          attributes: ["MACT_NOMBRE", "MACT_FOTO"],
          include: [
            {
              model: Especie,
              as: "Especie",
              attributes: ["ESP_NOMBRE"],
            },
          ],
        },
        {
          model: Usuario,
          as: "Veterinario",
          attributes: ["USUA_NOMBRES"],
        },
      ],
      attributes: [
        "CIT_ID",
        "CIT_FECHACITA",
        "CIT_HORA",
        "CIT_TIPO",
        "CIT_ESTADO",
        "CIT_OBSERVACIONMEDICA",
        "CIT_MOTIVOCITA",
      ],
      order: [
        ["CIT_FECHACITA", "ASC"],
        ["CIT_HORA", "ASC"],
      ],
    });

    // Formatear respuesta (igual que antes)
    const response = citas.map((cita) => ({
      id: cita.CIT_ID,
      mascota: {
        nombre: cita.Mascota?.MACT_NOMBRE || "Sin nombre",
        foto: cita.Mascota?.MACT_FOTO || null,
        especie: cita.Mascota?.Especie?.ESP_NOMBRE || "Sin especie",
      },
      fecha: cita.CIT_FECHACITA,
      hora: cita.CIT_HORA,
      tipo: cita.CIT_TIPO,
      estado: cita.CIT_ESTADO,
      motivo: cita.CIT_MOTIVOCITA || "Sin motivo especificado",
      observaciones: cita.CIT_OBSERVACIONMEDICA || "Sin observaciones",
      veterinario: {
        nombre: cita.Veterinario?.USUA_NOMBRES || "Sin asignar",
      },
    }));

    res.json(response);
  } catch (error) {
    console.error("Error en Obtener las Citas del Usuario: ", error);
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};

