const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const historialController = require('../controllers/historial.controller');
const gestionCitasController = require('../controllers/gestionCitas.controller');
//const { debugHistorial, getHistorialBackup ,obtenerHistorialEfectivo } = require('../controllers/historial.controller');
const authMiddleware = require('../middlewares/auth');
const {check} = require('express-validator');
const checkRole = require('../middlewares/checkRole');

router.post('/registrar',
    [
        check('MACT_ID', 'El ID de la mascota es requerido').isInt(),
        check('CIT_FECHACITA', 'La fecha es requerida (YYYY-MM-DD)').isDate(),
        check('CIT_HORA', 'La hora es requerida (HH:MM:SS)').matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    ],
    authMiddleware,checkRole([1,3]), citaController.registrarCita);

router.get('/mis-citas',authMiddleware, checkRole([1,3]),citaController.obtenerCitaUsuario);

//Rutas de administracion de las citas 

router.get('/filtrar', authMiddleware, checkRole([1,2]), gestionCitasController.filtrarCitas);

router.get('/mascota/:mascotaId', authMiddleware, checkRole([1, 2, 3]), gestionCitasController.obtenerCitasPorMacota);

router.put('/:id/reprogramar', authMiddleware, checkRole([1, 2]), gestionCitasController.reprogramarCita);

router.get('/citas-completas',authMiddleware, checkRole([1,2]),gestionCitasController.obtenerCitasCompletas);

router.put('/:id/cancelar',authMiddleware,checkRole([1,2]),gestionCitasController.cancelarCita);

router.put('/:id/atender',authMiddleware,checkRole([1,2]),gestionCitasController.atenderCita);

router.get('/:id/detalles', authMiddleware, checkRole([1,2]), gestionCitasController.obtenerDetallesCita);

//apartado del historialmendico 

router.get('/historial/:mascotaId', authMiddleware, checkRole([1, 2]), historialController.obtenerHistorialMascota);

router.post('/historial/crear', authMiddleware, checkRole([1, 2]), historialController.crearRegistroHistorial);
 
router.get('/historial/:mascotaId/tipo/:tipo', authMiddleware, checkRole([1, 2]), historialController.filtrarHistorialPorTipo);

/*
router.get('/historial/general', authMiddleware, historialController.obtenerHistorialGeneral);

router.get('/historial/debug', debugHistorial);
*/
router.get('/historial', authMiddleware, checkRole([1, 2]), historialController.obtenerHistorialEfectivo);


module.exports = router;