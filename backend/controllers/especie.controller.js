const { Especie } = require("../models");
const {Op} = require("sequelize");


exports.getAllEspecies = async (req, res) => {
  try {
    const especies = await Especie.findAll({
      attributes: ['ESP_ID', 'ESP_NOMBRE', 'ESP_DESCRIPCION'], // Selecciona campos explícitamente
      where:{
         ESP_ESTADO: 'activo'
      },
      order: [['ESP_NOMBRE', 'ASC']]
    });
    res.json(especies);
  } catch (error) {
    console.error('Error al obtener especies:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Función para obtener especies paginadas (para tabla)
exports.getEspecies = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const offset = (page - 1) * pageSize;

    const where = {
      ESP_ESTADO: 'activo' // Filtro base para estado activo
    };
    
    if (search) {
      where.ESP_NOMBRE = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Especie.findAndCountAll({
      where,
      attributes: ['ESP_ID', 'ESP_NOMBRE', 'ESP_DESCRIPCION', 'ESP_ESTADO', 'ESP_FECHACAMBIO'],
      order: [['ESP_NOMBRE', 'ASC']],
      limit: Number(pageSize),
      offset: Number(offset)
    });

    res.json({
      total: count,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(count / pageSize),
      especies: rows
    });
  } catch (error) {
    console.error('Error al obtener especies paginadas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

exports.createEspecie = async (req, res) => {
  const { ESP_NOMBRE, ESP_DESCRIPCION} = req.body;

  try {
    //Validacion básica
    if(!ESP_NOMBRE){
      return res.status(400).json({
        error:'Nombre es requerido',
        details:'El campo ESP_NOMBRE es obligatorio'
      });
    }

    const especie = await Especie.create({
      ESP_NOMBRE,
      ESP_DESCRIPCION: ESP_DESCRIPCION || null,
      ESP_CREADO_POR: req.user?.USUA_ID || null
    });

    res.status(201).json({
      ESP_ID: especie.ESP_ID,
      ESP_NOMBRE: especie.ESP_NOMBRE,
      ESP_DESCRIPCION: especie.ESP_DESCRIPCION,
      ESP_ESTADO: especie.ESP_ESTADO,
      ESP_FECHACAMBIO: especie.ESP_FECHACAMBIO
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El nombre de la especie ya existe' });
    }
    
    res.status(400).json({ 
      error: 'Error al crear especie',
      details: error.message 
    });
  }
};






// Obtener especies por ID 

exports.getEspecieById = async (req, res) => {
  try {
    const { id } = req.params;
    const especie = await Especie.findByPk(id , {
      attributes: ['ESP_ID','ESP_NOMBRE','ESP_DESCRIPCION', 'ESP_ESTADO','ESP_FECHACAMBIO']
    });
    if(!especie){
      return res.status(404).json({
        error: 'Especie no encontrada',
        details: `No se encontro especie con ID ${id}`
      });
    }
    res.json(especie);
  }catch(error){
    console.log('Error al obtener especie: ', error );
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}

//Actualizar especie

exports.updateEspecie = async (req, res) => {
  try{
    const { id } = req.params;
    const {ESP_NOMBRE, ESP_DESCRIPCION, ESP_ESTADO} = req.body;

    //validar que la menos uno de los campos sea proporcionado
    if(!ESP_NOMBRE && !ESP_DESCRIPCION && !ESP_ESTADO){
      return res.status(400).json({
        error: 'Datos insuficientes',
        details: 'Debe proporcionar al menos un campo'
      });
    }

    const especie = await Especie.findByPk(id);
    if(!especie){
      return res.status(404).json({
        error: 'Especie no encoentrada',
        details: `no se encontró especie con ID ${id}`
      });
    }

    //Verifica si el nuevo nombre ya existe (excluyendo la especie actual)
    if (ESP_NOMBRE && ESP_NOMBRE !== especie.ESP_NOMBRE){
      const especieExiste = await Especie.findOne({
        where: {
          ESP_NOMBRE,
          ESP_ID: {[Op.ne]:id}
        }
      });

      if(especieExiste){
        return res.status(400).json({
          error: 'Nombre ya existe',
          details: 'Ya existe otra especie con este nombre'
        });
      }
    }
    //Actualizar solo los campos proporcionados
    if(ESP_NOMBRE) especie.ESP_NOMBRE= ESP_NOMBRE;
    if(ESP_DESCRIPCION !== undefined) especie.ESP_DESCRIPCION = ESP_DESCRIPCION;
    if(ESP_ESTADO) especie.ESP_ESTADO = ESP_ESTADO;

    await especie.save();

    res.json({
      message: 'Especie actualizada exitosamente',
      especie:{
        ESP_ID: especie.ESP_ID,
        ESP_NOMBRE: especie.ESP_NOMBRE,
        ESP_DESCRIPCION: especie.ESP_DESCRIPCION,
        ESP_ESTADO: especie.ESP_ESTADO,
        ESP_FECHACAMBIO: especie.ESP_FECHACAMBIO
      }
    });
  }catch(error){
    console.error('Error al actualizar especie', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

//cambiar el estado de la especie 

exports.toggleEspecieStatus = async (req, res)=>{
  try{
    const {id} = req.params;

    const especie = await Especie.findByPk(id);
    if(!especie){
      return res.status(400).json({
        error: 'Especie no encontrada',
        details:`No se encontró especie con ID ${id}`
      })
    }
    // Cambiar estado 
    especie.ESP_ESTADO = especie.ESP_ESTADO === 'activo' ? 'inactivo': 'activo';
    await especie.save();

    res.json({
      message: 'Estado de la especie actualizado',
      especie:{
        ESP_ID: especie.ESP_ID,
        ESP_NOMBRE: especie.ESP_NOMBRE,
        ESP_ESTADO: especie.ESP_ESTADO
      }
    });
  }catch(error){
    console.error('Error al cambiar estadode especie ', error );
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

//Eliminacion de la especie 

exports.deleteEspecie = async (req,res)=>{
  try{
    const {id}= req.params;
    
    const especie = await Especie.findByPk(id);
    if(!especie){
      return res.status(404).json({
        error:'Especie no encontrada',
        details: `No se encontro especie con ID ${id}`
      })
    }

    await especie.destroy();

    res.json({
      message: 'Especie eliminada exitosamente',
      especie: {
        ESP_ID: especie.ESP_ID,
        ESP_NOMBRE: especie.ESP_NOMBRE
      }
    });
  }catch(error){
    console.error('Error al eliminar especie:', error);
    //
    if(error.name === 'SequelizeForeingKeyConstraintError'){
      return res.status(400).json({
        error: 'No se puede eliminar la especie',
        details:'Existen mascotas esociadas a esta especie'
      });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });

  }
};