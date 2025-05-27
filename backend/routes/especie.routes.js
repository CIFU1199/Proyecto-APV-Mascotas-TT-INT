const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const especieController = require('../controllers/especie.controller');

// solo acceso a veterinarios o Administradores

router.get('/getEspecies', authMiddleware, checkRole([1,2,3]), especieController.getAllEspecies);

router.get('/getEspecie', authMiddleware, checkRole([1,2]), especieController.getEspecies);
router.get('/getEspecie/:id', authMiddleware, checkRole([1,2]), especieController.getEspecieById);

router.post('/crearEspecie', authMiddleware, checkRole([1,2]), especieController.createEspecie);
router.put('/actualizar/:id', authMiddleware, checkRole([1,2]), especieController.updateEspecie);
router.patch('/toggle/:id/status', authMiddleware, checkRole([1,2]), especieController.toggleEspecieStatus);
router.delete('/eliminar/:id', authMiddleware, checkRole([1,2]), especieController.deleteEspecie); // Corregido el parámetro :id

module.exports = router;