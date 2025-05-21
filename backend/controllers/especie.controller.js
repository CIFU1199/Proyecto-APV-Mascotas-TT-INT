const { Especie } = require("../models");

exports.createEspecie = async (req, res) => {
  const { ESP_NOMBRE, ESP_DESCRIPCION} = req.body;

  try {
    const especie = await Especie.create({
      ESP_NOMBRE,
      ESP_DESCRIPCION,
      ESP_CREADO_POR: req.user.USUA_ID
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

exports.getAllEspecies = async (req, res) => {
  try {
    const especies = await Especie.findAll({
      attributes: ['ESP_ID', 'ESP_NOMBRE', 'ESP_DESCRIPCION'], // Selecciona campos explícitamente
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