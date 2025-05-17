const Usuario = require('../models/Usuario');
const { generateToken } = require('../utils/jwt');

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
  const { USUA_CORREO, USUA_PASSWORD } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { USUA_CORREO } });

    if (!usuario || !(await usuario.validPassword(USUA_PASSWORD))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(usuario.USUA_ID);

    res.json({ 
        token,
        userId:usuario.USUA_ID, //Usa el nombre correcto USUA_ID
        nombre: usuario.USUA_NOMBRES
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

  const { USUA_DOCUMENTO, USUA_NOMBRE, USUA_CORREO,USUA_PASSWORD, USUA_TELEFONO, ROL_ID} = req.body;

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
    res.status(400).json({error: error.message});
  }
}