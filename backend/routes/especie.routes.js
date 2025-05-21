const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const especieController = require('../controllers/especie.controller');

// solo acceso a veterinarios o Administradores

router.post('/crearEspecie',authMiddleware,checkRole([1,2,3]),especieController.createEspecie);
router.get('/getEspecies',authMiddleware,checkRole([1,2,3]), especieController.getAllEspecies);

module.exports = router;