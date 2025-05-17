const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const authMiddleware = require('../middlewares/auth');
const {check} = require('express-validator');

router.post('/registrar',
    [
        check('MACT_ID', 'El ID de la mascota es requerido').isInt(),
        check('CIT_FECHACITA', 'La fecha es requerida (YYYY-MM-DD)').isDate(),
        check('CIT_HORA', 'La hora es requerida (HH:MM:SS)').matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/),
        check('USUA_IDVETERINARIO', 'El ID del veterinario es requerido').isInt()
    ],
    authMiddleware, citaController.registrarCita);

module.exports = router;