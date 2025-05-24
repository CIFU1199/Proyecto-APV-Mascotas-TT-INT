const {Usuario} = require('../models');
const { generateToken } = require('../utils/jwt');
const { Op, Sequelize } = require('sequelize');

exports.register = async (req, res) => {
  const { USUA_DOCUMENTO, USUA_NOMBRES, USUA_CORREO, USUA_PASSWORD, USUA_TELEFONO} = req.body;

  try {
    const usuario = await Usuario.create({
      USUA_DOCUMENTO,
      USUA_NOMBRES,
      USUA_CORREO,
      USUA_PASSWORD,
      USUA_TELEFONO,
      ROL_ID:3 //asigna el rol de cliente por defecto
    });

    // Omitir la contraseña en la respuesta
    const usuarioResponse = usuario.get({ plain: true });
    delete usuarioResponse.USUA_PASSWORD;

    res.status(201).json(usuarioResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { USUA_CORREO, USUA_PASSWORD, ROL_ID } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { USUA_CORREO } });

    if (!usuario || !(await usuario.validPassword(USUA_PASSWORD))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(usuario.USUA_ID);

    res.json({ 
        token,
        userId:usuario.USUA_ID, //Usa el nombre correcto USUA_ID
        nombre: usuario.USUA_NOMBRES,
        rol:usuario.ROL_ID
    });
  } catch (error) {
    console.log('Error en login: ', error);
    res.status(500).json({ error: 'Error en el servidor '});
  }
};

exports.registerAsAdmin = async (req, res)=>{
  //solo los usuario adminsitradores con rolid=1 (administrador) pueden acceder a esta rura

  if (req.user.rol !== 1){
    return res.status(403).json({error:'Solo el administrador puede acceder a esta funcion'});
  }

  const { USUA_DOCUMENTO, USUA_NOMBRES, USUA_CORREO,USUA_PASSWORD, USUA_TELEFONO, ROL_ID} = req.body;

  try{
    const usuario = await Usuario.create({
      USUA_DOCUMENTO,
      USUA_NOMBRES,
      USUA_CORREO,
      USUA_PASSWORD,
      USUA_TELEFONO,
      ROL_ID: ROL_ID || 3 // usa el rol por defecto o el rol enviado 
    })

    const usuarioResponse = usuario.get({plain: true});
    delete usuarioResponse.USUA_PASSWORD;
    res.status(201).json(usuarioResponse);
  }catch(error){
    console.log('Error en registerAsAdmin: ', error);
    res.status(400).json({error: error.message});
  }
}


exports.listarUsuarios = async (req,res) =>{
  try{
    const { rol, busqueda, pagina = 1, porPagina = 10} = req.query;
    const offset = (pagina - 1) * porPagina;
    
    //Construir el Objeto where
    const where = {};

    if(rol){
      where.ROL_ID = rol;
    }

    if (busqueda){
      where[Op.or] = [
        { USUA_NOMBRES: { [Op.like]: `%${busqueda}%` } },
        { USUA_DOCUMENTO: { [Op.like]: `%${busqueda}%` } },
        { USUA_CORREO: { [Op.like]: `%${busqueda}%` } }
      ];
    }
    // Consulta con Sequelize 
    const { count, rows } = await Usuario.findAndCountAll({
      where,
      attributes: { 
        exclude: ['USUA_PASSWORD'] // Excluir contraseña
      },
      limit: Number(porPagina),
      offset: Number(offset),
      order: [['USUA_NOMBRES', 'ASC']]
    });

    // Formatear respuesta
    const respuesta = {
      totalUsuarios: count,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(count / porPagina),
      porPagina: Number(porPagina),
      usuarios: rows.map(usuario => ({
        id: usuario.USUA_ID,
        documento: usuario.USUA_DOCUMENTO,
        nombre: usuario.USUA_NOMBRES,
        correo: usuario.USUA_CORREO,
        telefono: usuario.USUA_TELEFONO,
        rol: usuario.ROL_ID,
        estado: usuario.USUA_ESTADO,
        fechaCreacion: usuario.createdAt
      }))
    };
    res.json(respuesta);
  }catch(error){
    console.error('Error al listar usuarios: ', error);
    res.status(500).json({
      error: 'Error interno del servido',
      detalles: error.message
    });
  }
}

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      documento, 
      nombres, 
      correo, 
      telefono, 
      rol, 
      estado 
    } = req.body;

    // Validaciones básicas
    if (!documento || !nombres || !correo) {
      return res.status(400).json({
        error: 'Datos incompletos',
        detalles: 'Documento, nombres y correo son obligatorios'
      });
    }

    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findByPk(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        detalles: `No existe un usuario con el ID ${id}`
      });
    }

    // Verificar duplicados
    const where = {
      [Op.or]: [
        { USUA_DOCUMENTO: documento },
        { USUA_CORREO: correo }
      ],
      USUA_ID: { [Op.ne]: id }
    };

    const usuarioDuplicado = await Usuario.findOne({ where });
    if (usuarioDuplicado) {
      const campo = usuarioDuplicado.USUA_DOCUMENTO === documento ? 'documento' : 'correo';
      return res.status(400).json({
        error: `${campo} ya registrado`,
        detalles: `El ${campo} proporcionado ya está en uso por otro usuario`
      });
    }

    // Actualizar el usuario
    await Usuario.update(
      {
        USUA_DOCUMENTO: documento,
        USUA_NOMBRES: nombres,
        USUA_CORREO: correo,
        USUA_TELEFONO: telefono || null,
        ROL_ID: rol || usuarioExistente.ROL_ID,
        USUA_ESTADO: estado !== undefined ? estado : usuarioExistente.USUA_ESTADO
      },
      { where: { USUA_ID: id } }
    );

    // Obtener el usuario actualizado para la respuesta
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['USUA_PASSWORD'] }
    });

    // Formatear respuesta
    const respuesta = {
      mensaje: 'Usuario actualizado correctamente',
      usuario: {
        id: usuarioActualizado.USUA_ID,
        documento: usuarioActualizado.USUA_DOCUMENTO,
        nombre: usuarioActualizado.USUA_NOMBRES,
        correo: usuarioActualizado.USUA_CORREO,
        telefono: usuarioActualizado.USUA_TELEFONO,
        rol: usuarioActualizado.ROL_ID,
        estado: usuarioActualizado.USUA_ESTADO,
        fechaActualizacion: usuarioActualizado.updatedAt
      }
    };

    res.json(respuesta);

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
};