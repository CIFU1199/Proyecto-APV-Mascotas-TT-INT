const { verifyToken } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extraer el token del header 'Authorization'
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // 2. Verificar y decodificar el token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }

    // 3. Buscar al usuario en la base de datos (opcional pero recomendado)
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // 4. Adjuntar el usuario a la solicitud para uso en rutas
    req.user = {
      id: usuario.USUA_ID,
      rol: usuario.ROL_ID // Si necesitas validar roles
    };

    next(); // Continuar al controlador
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({ error: 'Error al autenticar el token.' });
  }
};

module.exports = authMiddleware;