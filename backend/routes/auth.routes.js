const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.post('/admin/register',authMiddleware,checkRole([1]),authController.registerAsAdmin);
router.get('/admin/listar',authMiddleware,checkRole([1]),authController.listarUsuarios);
router.put('/admin/actualizar/:id', authMiddleware, checkRole([1]), authController.actualizarUsuario);

//rutas publicas
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
