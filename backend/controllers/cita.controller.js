const { Cita, Mascota, Usuario, sequelize } = require("../models");
const { validationResult } = require("express-validator");

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
      USUA_IDVETERINARIO,
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
        USUA_IDVETERINARIO,
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
        USUA_IDVETERINARIO,
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
      return res
        .status(400)
        .json({
          error: "Error de referencia. Verifica los IDs proporcionados.",
        });
    }

    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
};
