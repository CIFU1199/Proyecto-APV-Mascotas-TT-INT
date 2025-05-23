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
      CIT_MOTIVOCITA,
      //USUA_IDVETERINARIO,
    } = req.body;

    //Validar que exista la mascota
    const mascota = await Mascota.findByPk(MACT_ID, { transaction });
    if (!mascota) {
      await transaction.rollback();
      return res.status(404).json({ error: "La mascota no existe" });
    }
    //Validar que el Veterinario Exista
    const veterinario = await Usuario.findByPk(USUA_IDVETERINARIO, {
      transaction,
    });
    if (!veterinario || veterinario.ROL_ID !== 2) {
      await transaction.rollback();
      return res.status(404).json({ error: "El veterinario no es Valido" });
    }

    //Validar disponibilidad del veterinario (evitar solapamiento)

    const citaExistente = await Cita.findOne({
      where: {
        //USUA_IDVETERINARIO,
        CIT_FECHACITA,
        CIT_HORA,
      },
      transaction,
    });
    if (citaExistente) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ error: "El veterinario ya tiene una cita en ese horario" });
    }
    const horaCita = new Date(`1970-01-01T${CIT_HORA}`);
    const horaInicio = new Date(`1970-01-01T08:00:00`);
    const horaFin = new Date(`1970-01-01T17:00:00`);

    if (horaCita < horaInicio || horaCita > horaFin) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "El horario debe ser entre 8:00 AM y 5:00 PM" });
    }

    //Crear la Cita

    const nuevaCita = await Cita.create(
      {
        MACT_ID,
        CIT_FECHACITA,
        CIT_HORA,
        CIT_DURACION: CIT_DURACION || 30,
        CIT_TIPO: CIT_TIPO || "consulta",
        CIT_ESTADO: "Pendiente",
        CIT_MOTIVOCITA,
        //USUA_IDVETERINARIO,
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

exports.obtenerCitasCompletas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Mascota,
          as: "Mascota",
          attributes: [
            "MACT_NOMBRE",
            "MACT_FECHA_NACIMIENTO",
            "MACT_RAZA",
            "MACT_PESO",
            "MACT_COLOR",
            "MACT_FOTO",
          ],
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
        "CIT_MOTIVOCITA",
      ],
      order: [
        ["CIT_FECHACITA", "ASC"],
        ["CIT_HORA", "ASC"],
      ],
    });

    //Formatera respusesta con calulo de edad
    const response = citas.map((cita) => {
      const edadMascota = calcularEdad(cita.Mascota.MACT_FECHA_NACIMIENTO);

      return {
        id: cita.CIT_ID,
        mascota: {
          nombre: cita.Mascota.MACT_NOMBRE,
          especie: cita.Mascota.Especie.ESP_NOMBRE,
          edad: edadMascota,
          raza: cita.Mascota.MACT_RAZA,
          peso: cita.Mascota.MACT_PESO,
          color: cita.Mascota.MACT_COLOR,
          foto: cita.Mascota.MACT_FOTO,
        },
        dueño: cita.Mascota.Dueño.USUA_NOMBRES,
        veterinario: cita.Veterinario.USUA_NOMBRES,
        fecha: cita.CIT_FECHACITA,
        hora: cita.CIT_HORA,
        tipo: cita.CIT_TIPO,
        estado: cita.CIT_ESTADO,
        motivo: cita.CIT_MOTIVOCITA,
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
        hora: citaActualizada.CIT_HORA
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
