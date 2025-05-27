const {
  Cita,
  Mascota,
  Usuario,
  Especie,
  HistorialMedico,
  sequelize,
} = require("../models");


const { calcularEdad } = require("../utils/helpers");

//obtiene el historial de las mascotas 

exports.obtenerHistorialMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    const historial = await HistorialMedico.findAll({
      where: { MACT_ID: mascotaId },
      include: [
        { 
          model: Cita,
          as: "Cita",
          include: [
            {
              model: Mascota,
              as: "Mascota",
              include: [
                { model: Especie, as: "Especie" },
                { 
                  model: Usuario, 
                  as: "Dueño",
                  attributes: ["USUA_ID", "USUA_NOMBRES", "USUA_TELEFONO"]
                }
              ]
            },
            { 
              model: Usuario, 
              as: "Veterinario",
              attributes: ["USUA_ID", "USUA_NOMBRES"]
            }
          ]
        },
        { 
          model: Usuario, 
          as: "VeterinarioHistorial", // ✅ CORRECTO
          attributes: ["USUA_NOMBRES"] 
        },
      ],
      order: [["HM_FECHA", "DESC"]],
    });

    const historialProcesado = historial.map(registro => {
      const mascota = registro.Cita?.Mascota;
      const cita = registro.Cita;
      
      return {
        id: registro.HM_ID,
        fechaHistorial: registro.HM_FECHA,
        tipo: registro.HM_TIPO,
        descripcion: registro.HM_DESCRIPCION,
        detalles: registro.HM_DETALLES,
        observaciones: registro.HM_OBSERVACIONES,
        veterinarioHistorial: registro.VeterinarioHistorial?.USUA_NOMBRES || "No especificado",
        
        // Datos de la mascota
        nombreMascota: mascota?.MACT_NOMBRE,
        especie: mascota?.Especie?.ESP_NOMBRE,
        sexo: mascota?.MACT_SEXO,
        edad: calcularEdad(mascota?.MACT_FECHA_NACIMIENTO),
        raza: mascota?.MACT_RAZA,
        peso: mascota?.MACT_PESO,
        color: mascota?.MACT_COLOR,
        foto: mascota?.MACT_FOTO,
        
        // Datos del dueño
        nombreDueno: mascota?.Dueño?.USUA_NOMBRES || 'No especificado',
        telefonoDueno: mascota?.Dueño?.USUA_TELEFONO || 'No especificado',
        
        // Datos de la cita (si existe)
        ...(cita ? {
          citaId: cita.CIT_ID,
          fechaCita: cita.CIT_FECHA,
          horaCita: cita.CIT_HORA_INICIO,
          duracion: cita.CIT_DURACION,
          tipoCita: cita.CIT_TIPO,
          estadoCita: cita.CIT_ESTADO,
          motivoCita: cita.CIT_MOTIVO,
          veterinarioCita: cita.Veterinario?.USUA_NOMBRES || 'No especificado',
          observacionCita: cita.CIT_OBSERVACIONMEDICA
        } : {})
      };
    });

    res.json(historialProcesado);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ 
      error: "Error al obtener historial", 
      detalle: error.message
    });
  }
};


// Crear un registro manual al historial
exports.crearRegistroHistorial = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { mascotaId, citaId, tipo, descripcion, detalles, observaciones } = req.body;
        const usuarioId = req.user.id;

        if (!mascotaId || !tipo || typeof tipo !== 'string') {
            await t.rollback();
            return res.status(400).json({ error: "Datos incompletos o inválidos para crear historial" });
        }

        if (citaId && tipo !== 'consulta') {
            await t.rollback();
            return res.status(400).json({ 
                error: "El tipo debe ser 'consulta' para registros asociados a citas" 
            });
        }

        // Validar que la mascota exista
        const mascota = await Mascota.findByPk(mascotaId);
        if (!mascota) {
            await t.rollback();
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        if (citaId) {
            const existeHistorial = await HistorialMedico.findOne({
                where: { CIT_ID: citaId },
                transaction: t
            });

            if (existeHistorial) {
                await t.rollback();
                return res.status(400).json({
                    error: "Ya existe un registro de historial para esta cita",
                    historialId: existeHistorial.HM_ID
                });
            }
        }

        const nuevoRegistro = await HistorialMedico.create({
            MACT_ID: mascotaId,
            CIT_ID: citaId || null,
            HM_FECHA: new Date(),
            HM_TIPO: tipo,
            HM_DESCRIPCION: descripcion,
            HM_DETALLES: detalles,
            HM_OBSERVACIONES: observaciones,
            USUA_IDVETERINARIO: usuarioId,
            HM_FECHACAMBIO: new Date()
        }, { transaction: t });

        if (citaId) {
            await Cita.update(
                { CIT_ESTADO: 'Atendida' },
                { where: { CIT_ID: citaId }, transaction: t }
            );
        }

        await t.commit();

        const registroCompleto = await HistorialMedico.findByPk(nuevoRegistro.HM_ID, {
            include: [
                {
                    model: Cita,
                    as: 'Cita',
                    include: [{
                        model: Mascota,
                        as: 'Mascota',
                        attributes: ['MACT_NOMBRE']
                    }]
                },
                {
                    model: Usuario,
                    as: 'Veterinario',
                    attributes: ['USUA_NOMBRES']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: citaId ? 'Registro de historial creado y cita marcada como atendida' : 'Registro de historial creado',
            registro: {
                id: registroCompleto.HM_ID,
                fecha: registroCompleto.HM_FECHA,
                tipo: registroCompleto.HM_TIPO,
                descripcion: registroCompleto.HM_DESCRIPCION,
                observaciones: registroCompleto.HM_OBSERVACIONES,
                veterinario: registroCompleto.Veterinario?.USUA_NOMBRES || "No especificado",
                mascotaNombre: registroCompleto.Cita?.Mascota?.MACT_NOMBRE || null,
                asociadaACita: !!registroCompleto.Cita,
                citaId: registroCompleto.CIT_ID
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Error al crear registro:", error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ error: "Datos de referencia inválidos", detalle: error.message });
        }

        res.status(500).json({ 
            error: "Error al crear registro de historial", 
            detalle: error.message
        });
    }
};


//Filtrar el historial por tipo 

exports.filtrarHistorialPorTipo = async (req, res) => {
    try {
        const { mascotaId, tipo } = req.params;
        const historial = await HistorialMedico.findAll({
            where: { MACT_ID: mascotaId, HM_TIPO: tipo },
            include: [
                { 
                    model: Cita,
                    as: "Cita",
                    include: [
                        {
                            model: Mascota,
                            as: "Mascota",
                            include: [
                                { model: Especie, as: "Especie" },
                                { 
                                    model: Usuario, 
                                    as: "Dueño",
                                    attributes: ["USUA_ID", "USUA_NOMBRES", "USUA_TELEFONO"]
                                }
                            ]
                        },
                        { 
                            model: Usuario, 
                            as: "Veterinario",
                            attributes: ["USUA_ID", "USUA_NOMBRES"]
                        }
                    ]
                },
                { 
                    model: Usuario, 
                    as: "Veterinario", 
                    attributes: ["USUA_NOMBRES"] 
                },
            ],
            order: [["HM_FECHA", "DESC"]],
        });

        const historialProcesado = historial.map(registro => {
            const mascota = registro.Cita?.Mascota;
            const cita = registro.Cita;

            return {
                id: registro.HM_ID,
                fechaHistorial: registro.HM_FECHA,
                tipo: registro.HM_TIPO,
                descripcion: registro.HM_DESCRIPCION,
                detalles: registro.HM_DETALLES,
                observaciones: registro.HM_OBSERVACIONES,
                veterinarioHistorial: `${registro.Veterinario?.USUA_NOMBRES}`,
                
                // Datos de la mascota
                nombreMascota: mascota?.MACT_NOMBRE,
                especie: mascota?.Especie?.ESP_NOMBRE,
                sexo: mascota?.MACT_SEXO,
                edad: calcularEdad(mascota?.MACT_FECHA_NACIMIENTO),
                raza: mascota?.MACT_RAZA,
                peso: mascota?.MACT_PESO,
                color: mascota?.MACT_COLOR,
                foto: mascota?.MACT_FOTO,

                // Datos del dueño
                nombreDueno: mascota?.Dueño ? 
                    `${mascota.Dueño.USUA_NOMBRES}` : 
                    'No especificado',
                telefonoDueno: mascota?.Dueño?.USUA_TELEFONO || 'No especificado',
                
                // Datos de la cita
                ...(cita ? {
                    citaId: cita.CIT_ID,
                    fechaCita: cita.CIT_FECHA,
                    horaCita: cita.CIT_HORA_INICIO,
                    duracion: cita.CIT_DURACION,
                    tipoCita: cita.CIT_TIPO,
                    estadoCita: cita.CIT_ESTADO,
                    motivoCita: cita.CIT_MOTIVO,
                    veterinarioCita: cita.Veterinario ? 
                        `${cita.Veterinario.USUA_NOMBRES}` : 
                        'No especificado',
                    observacionCita: cita.CIT_OBSERVACIONMEDICA
                } : {})
            };
        });

        res.json(historialProcesado);
    } catch (error) {
        console.error("Error interno del servidor: ", error);
        res.status(500).json({ error: "Error al obtener historial", detalle: error.message });
    }
};


/*
// Obtener historial médico general de todas las mascotas
exports.obtenerHistorialGeneral = async (req, res) => {
    try {
        // 1. Primero verifica si hay datos básicos
        const totalRegistros = await HistorialMedico.count();
        console.log(`Total de registros en HistorialMedico: ${totalRegistros}`);
        
        if (totalRegistros === 0) {
            return res.status(404).json({ 
                message: "No se encontraron registros médicos",
                suggestion: "Verifique que existan datos en la tabla historial_medico"
            });
        }

        // 2. Consulta con logging detallado
        const historial = await HistorialMedico.findAll({
            include: [
                { 
                    model: Mascota,
                    as: "Mascota",
                    attributes: ["MACT_NOMBRE", "MACT_ID"],
                    required: false,
                    include: [
                        {
                            model: Especie,
                            as: "Especie",
                            attributes: ["ESP_NOMBRE"]
                        }
                    ]
                },
                { 
                    model: Cita,
                    as: "Cita",
                    attributes: ["CIT_FECHA", "CIT_TIPO", "CIT_MOTIVO"],
                    required: false,
                    include: [
                        {
                            model: Usuario,
                            as: "Veterinario",
                            attributes: ["USUA_NOMBRES"]
                        }
                    ]
                },
                { 
                    model: Usuario, 
                    as: "Veterinario", 
                    attributes: ["USUA_NOMBRES"],
                    required: false
                }
            ],
            order: [["HM_FECHA", "DESC"]],
            logging: console.log // Muestra la consulta SQL en consola
        });

        console.log(`Registros encontrados: ${historial.length}`);

        // 3. Transformación de datos similar al método que funciona
        const historialProcesado = historial.map(registro => {
            // Datos básicos del historial
            const datosBase = {
                id: registro.HM_ID,
                fechaHistorial: registro.HM_FECHA,
                tipo: registro.HM_TIPO,
                descripcion: registro.HM_DESCRIPCION,
                observaciones: registro.HM_OBSERVACIONES,
                veterinarioHistorial: registro.Veterinario?.USUA_NOMBRES || 'No especificado'
            };

            // Datos de la mascota (si existe)
            if (registro.Mascota) {
                datosBase.mascota = {
                    id: registro.Mascota.MACT_ID,
                    nombre: registro.Mascota.MACT_NOMBRE,
                    especie: registro.Mascota.Especie?.ESP_NOMBRE || 'No especificada'
                };
            }

            // Datos de la cita (si existe)
            if (registro.Cita) {
                datosBase.cita = {
                    fecha: registro.Cita.CIT_FECHA,
                    tipo: registro.Cita.CIT_TIPO,
                    motivo: registro.Cita.CIT_MOTIVO,
                    veterinario: registro.Cita.Veterinario?.USUA_NOMBRES || 
                                registro.Veterinario?.USUA_NOMBRES || 
                                'No especificado'
                };
            }

            return datosBase;
        });

        if (historialProcesado.length === 0) {
            console.warn("Advertencia: La consulta devolvió registros pero la transformación resultó vacía");
            console.log("Datos crudos obtenidos:", JSON.stringify(historial, null, 2));
        }

        res.json(historialProcesado);
    } catch (error) {
        console.error("Error completo al obtener historial general:", {
            message: error.message,
            stack: error.stack,
            sql: error.sql // Si es un error de Sequelize
        });
        
        res.status(500).json({ 
            error: "Error interno al obtener historial médico general",
            detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
*/
/*
exports.obtenerHistorialGeneral = async (req, res) => {
    const historial = await HistorialMedico.findAll();
    console.log(historial);

  try {
    const count = await HistorialMedico.count();
    console.log(`✅ Total registros en HistorialMedico: ${count}`);
    
    if (count === 0) {
      console.log("❌ No hay registros en HistorialMedico");
      return res.status(404).json({ 
        message: "No se encontraron registros médicos",
        suggestion: "Verifica que existan datos en la tabla historial_medico"
      });
    }

    const historial = await HistorialMedico.findAll({
      attributes: ['HM_ID', 'HM_FECHA', 'HM_TIPO', 'HM_DESCRIPCION', 'HM_OBSERVACIONES'],
      include: [
        {
          model: Mascota,
          as: 'Mascota',
          attributes: ['MACT_NOMBRE']
        },
        {
          model: Usuario,
          as: 'VeterinarioHistorial',
          attributes: ['USUA_NOMBRES'],
          required: false
        },
        {
          model: Cita,
          as: 'Cita',
          attributes: ['CIT_FECHA', 'CIT_HORA']
        }
      ],
      order: [['HM_FECHA', 'DESC']],
      limit: 100,
      logging: console.log // Log SQL para ver qué consulta genera Sequelize
    });

    console.log(`✅ Registros obtenidos: ${historial.length}`);

    const datos = historial.map(item => ({
      id: item.HM_ID,
      fecha: item.HM_FECHA,
      tipo: item.HM_TIPO,
      descripcion: item.HM_DESCRIPCION,
      observaciones: item.HM_OBSERVACIONES,
      mascota: item.Mascota?.MACT_NOMBRE || "Sin mascota",
      veterinario: item.VeterinarioHistorial?.USUA_NOMBRES || "No especificado"
    }));

    res.json(datos);
  } catch (error) {
    console.error('❌ Error completo:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      parameters: error.parameters
    });
    
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sql: process.env.NODE_ENV === 'development' ? error.sql : undefined
    });
  }
};


exports.debugHistorial = async (req, res) => {
  try {
    // 1. Verificar conexión directa con la BD
    const [directResult] = await sequelize.query('SELECT 1+1 AS test');
    console.log('Prueba matemática en BD:', directResult[0].test); // Debería ser 2

    // 2. Contar registros en la tabla
    const [countResult] = await sequelize.query('SELECT COUNT(*) AS total FROM historial_medico');
    const dbCount = countResult[0].total;
    console.log('Registros en BD:', dbCount);

    // 3. Consulta con Sequelize
    const sequelizeResult = await HistorialMedico.findAll({
      raw: true,
      limit: 1,
      logging: console.log // Mostrará la consulta SQL generada
    });

    // 4. Comparar resultados
    const comparison = {
      conexionBD: directResult[0].test === 2 ? 'OK' : 'FALLÓ',
      registrosEnBD: dbCount,
      registrosSequelize: sequelizeResult.length,
      consultaSQLGenerada: 'Ver consola',
      primerRegistroBD: null,
      primerRegistroSequelize: sequelizeResult[0] || null
    };

    // 5. Obtener un registro directamente para comparación
    if (dbCount > 0) {
      const [dbRow] = await sequelize.query('SELECT * FROM historial_medico LIMIT 1');
      comparison.primerRegistroBD = dbRow[0];
    }

    // 6. Respuesta detallada
    res.json({
      status: 'Diagnóstico completo',
      results: comparison,
      conclusions: {
        bdConnection: comparison.conexionBD === 'OK' ? 'Conexión exitosa' : 'Problema de conexión',
        dataDiscrepancy: dbCount > 0 && sequelizeResult.length === 0 ? 
          'SEQUELIZE NO PUEDE LEER DATOS EXISTENTES' : 'Coincidencia de datos',
        recommendedActions: [
          'Verificar permisos de usuario de BD',
          'Comparar credenciales en conexión directa vs Sequelize',
          'Revisar configuración de modelos'
        ]
      }
    });

  } catch (error) {
    console.error('Error en debug:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({
      error: "Error de diagnóstico",
      details: {
        message: error.message,
        sqlError: error.sql,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};


exports.getHistorialBackup = async (req, res) => {
  try {
    // 1. Intento con Sequelize
    const sequelizeData = await HistorialMedico.findAll({
      attributes: ['HM_ID', 'HM_FECHA', 'HM_TIPO', 'HM_DESCRIPCION'],
      raw: true,
      limit: 50
    });

    // 2. Si Sequelize falla, usar consulta directa
    if (!sequelizeData || sequelizeData.length === 0) {
      console.warn('Sequelize no devolvió datos, usando consulta directa');
      const [directData] = await sequelize.query(`
        SELECT HM_ID, HM_FECHA, HM_TIPO, HM_DESCRIPCION 
        FROM historial_medico 
        ORDER BY HM_FECHA DESC 
        LIMIT 50
      `);
      
      return res.json({
        source: 'direct_query',
        data: directData,
        count: directData.length
      });
    }

    // 3. Respuesta exitosa
    res.json({
      source: 'sequelize',
      data: sequelizeData,
      count: sequelizeData.length
    });

  } catch (error) {
    // 4. Último recurso: respuesta estática de diagnóstico
    console.error('Error crítico:', error);
    res.status(500).json({
      error: "Error crítico en el servidor",
      diagnostic: {
        sequelizeAvailable: typeof Sequelize !== 'undefined',
        modelsInitialized: !!HistorialMedico,
        dbConnection: sequelize.authenticate ? await sequelize.authenticate().then(() => 'OK').catch(() => 'FAILED') : 'UNKNOWN'
      },
      instructions: "Contacte al administrador con esta información"
    });
  }
};
*/

exports.obtenerHistorialEfectivo = async (req, res) => {
  try {
    // 1. Consulta eficiente con Sequelize
    const historial = await HistorialMedico.findAll({
      attributes: [
        'HM_ID',
        'MACT_ID', 
        'HM_FECHA', 
        'HM_TIPO', 
        'HM_DESCRIPCION',
        'HM_OBSERVACIONES',
        'USUA_IDVETERINARIO'
      ],include:[
        {
            model:Mascota,
            as: 'Mascota',
            attributes: ['MACT_NOMBRE'],
            required: false
        },
        {
            model:Usuario,
            as:'VeterinarioHistorial',
            attributes:['USUA_NOMBRES'],
            require: false
        }
      ],
      order: [['HM_FECHA', 'DESC']],
      limit: 100,
      raw: true, // Crucial para mejor rendimiento
      nest: true
    });

    // 2. Formateo de respuesta consistente
    const respuesta = {
      source: 'sequelize',
      count: historial.length,
      data: historial.map(item => ({
        id: item.HM_ID,
        mascota:{
            id: item.MACT_ID,
            nombre: item.Mascota?.MACT_NOMBRE || 'Sin nombre'
        },
        fecha: item.HM_FECHA,
        tipo: item.HM_TIPO,
        descripcion: item.HM_DESCRIPCION,
        observaciones: item.HM_OBSERVACIONES,
        veterinarioId: item.USUA_IDVETERINARIO,
        veterinarioNombre: item.VeterinarioHistorial?.USUA_NOMBRES || 'No especificado'
      }))
    };

    res.json(respuesta);

  } catch (error) {
    console.error('Error en obtenerHistorialEfectivo:', {
      message: error.message,
      stack: error.stack
    });
    
    // Respuesta de error estructurada
    res.status(500).json({
      error: "Error al obtener historial",
      details: {
        suggestion: "Verifique los logs del servidor",
        sequelizeError: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    });
  }
};