import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, Button, Chip, Modal, Box, TextField, MenuItem, Avatar, CircularProgress
} from '@mui/material';
import HistorialService from '../../api/historialService';
import { type HistorialGeneral } from '../../api/historialService';

const styleModal = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

const HistorialMascotaPage: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<HistorialGeneral | null>(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    mascotaId: '',
    tipo: '',
    descripcion: '',
    detalles: '',
    observaciones: ''
  });

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const res = await HistorialService.obtenerHistorialGeneral();
      setHistorial(res);
      setError(null);
    } catch (err) {
      console.error('Error al obtener historial general', err);
      setError('No se pudo cargar el historial médico');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const handleAbrirDetalle = (registro: HistorialGeneral) => {
    setRegistroSeleccionado(registro);
    setModalDetalle(true);
  };

  const handleGuardarNuevo = async () => {
    if (!nuevoRegistro.tipo || !nuevoRegistro.descripcion || !nuevoRegistro.mascotaId) {
      setError('Complete los campos requeridos');
      return;
    }
    
    try {
      await HistorialService.crearRegistroHistorial({
        mascotaId: Number(nuevoRegistro.mascotaId),
        tipo: nuevoRegistro.tipo,
        descripcion: nuevoRegistro.descripcion,
        detalles: nuevoRegistro.detalles,
        observaciones: nuevoRegistro.observaciones
      });
      setModalNuevo(false);
      setNuevoRegistro({ tipo: '', descripcion: '', detalles: '', observaciones: '', mascotaId: '' });
      await cargarHistorial();
    } catch (err) {
      console.error('Error al crear registro:', err);
      setError('Error al crear el registro');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={cargarHistorial} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Container>
    );
  }

  if (historial.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>No hay registros médicos disponibles</Typography>
        <Button 
          variant="contained" 
          onClick={() => setModalNuevo(true)}
          sx={{ mt: 2 }}
        >
          Crear primer registro
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Historial Médico General
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setModalNuevo(true)}
        >
          Nuevo Registro
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="Tabla de historial médico">
          <TableHead>
            <TableRow>
              <TableCell>Mascota</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Veterinario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>{registro.mascota.nombre.charAt(0)}</Avatar>
                    {registro.mascota.nombre}
                  </Box>
                </TableCell>
                <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={registro.tipo} 
                    color={
                      registro.tipo === 'consulta' ? 'primary' : 
                      registro.tipo === 'vacunación' ? 'success' : 
                      'secondary'
                    } 
                  />
                </TableCell>
                <TableCell sx={{ 
                  maxWidth: 200,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {registro.descripcion}
                </TableCell>
                <TableCell>{registro.veterinarioNombre}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleAbrirDetalle(registro)}
                  >
                    Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalle */}
      <Modal open={modalDetalle} onClose={() => setModalDetalle(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom>
            Detalles del Registro Médico
          </Typography>
          {registroSeleccionado && (
            <Box mt={2}>
              <Typography><strong>Mascota:</strong> {registroSeleccionado.mascota.nombre}</Typography>
              <Typography><strong>Fecha:</strong> {new Date(registroSeleccionado.fecha).toLocaleDateString()}</Typography>
              <Typography><strong>Tipo:</strong> {registroSeleccionado.tipo}</Typography>
              <Typography><strong>Descripción:</strong> {registroSeleccionado.descripcion}</Typography>
              <Typography><strong>Observaciones:</strong> {registroSeleccionado.observaciones}</Typography>
              <Typography><strong>Veterinario:</strong> {registroSeleccionado.veterinarioNombre}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Modal de Nuevo Registro */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom>
            Nuevo Registro Médico
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="ID de Mascota"
              type="number"
              value={nuevoRegistro.mascotaId}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, mascotaId: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              select
              label="Tipo"
              value={nuevoRegistro.tipo}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, tipo: e.target.value })}
              fullWidth
              required
            >
              <MenuItem value="consulta">Consulta</MenuItem>
              <MenuItem value="vacunación">Vacunación</MenuItem>
              <MenuItem value="cirugía">Cirugía</MenuItem>
              <MenuItem value="emergencia">Emergencia</MenuItem>
              <MenuItem value="estética">Estética</MenuItem>
              <MenuItem value="otros">Otros</MenuItem>
            </TextField>
            
            <TextField
              label="Descripción"
              value={nuevoRegistro.descripcion}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, descripcion: e.target.value })}
              multiline
              rows={2}
              fullWidth
              required
            />
            
            <TextField
              label="Detalles"
              value={nuevoRegistro.detalles}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, detalles: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            
            <TextField
              label="Observaciones"
              value={nuevoRegistro.observaciones}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, observaciones: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => setModalNuevo(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                onClick={handleGuardarNuevo}
                disabled={!nuevoRegistro.tipo || !nuevoRegistro.descripcion || !nuevoRegistro.mascotaId}
              >
                Guardar Registro
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default HistorialMascotaPage;