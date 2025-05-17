const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascota.controller');
const authMiddleware = require('../middlewares/auth')


//Ruta Protegida requiere autenticacion 
router.post('/registrar',authMiddleware, mascotaController.registrarMascota);

module.exports = router;