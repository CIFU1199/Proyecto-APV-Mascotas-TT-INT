const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascota.controller');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/uploadMascota');
const checkRole = require('../middlewares/checkRole');


//Ruta Protegida requiere autenticacion 
router.post('/registrar',authMiddleware,checkRole([1,2,3]),upload.single('MACT_FOTO'), mascotaController.registrarMascota);
router.get('/mis-mascotas', authMiddleware ,checkRole([1,2,3]) ,mascotaController.obtenerMisMascotas)

module.exports = router;