const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticas.controller');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');



router.get('/general', authMiddleware,checkRole([1,2]), estadisticasController.obtenerEstadisticas);

module.exports = router;