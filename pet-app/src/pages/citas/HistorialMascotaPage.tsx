import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, Button, Chip, Modal, Box, TextField, MenuItem
} from '@mui/material';
import HistorialService from '../../api/historialService';

interface HistorialGeneral {
  id: number;
  mascota: string;
  fecha: string;
  tipo: string;
  descripcion: string;
  observaciones: string;
  detalles: string;
  veterinario: string;
}

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
      const res = await HistorialService.obtenerHistorialGeneral();
      setHistorial(res.data);
    } catch (error) {
      console.error('Error al obtener historial general', error);
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
    if (!nuevoRegistro.tipo || !nuevoRegistro.descripcion || !nuevoRegistro.mascotaId) return;
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
      cargarHistorial();
    } catch (error) {
      console.error('Error al crear registro:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Historial Médico General</Typography>
        <Button variant="contained" onClick={() => setModalNuevo(true)}>Registrar nuevo</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mascota</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Veterinario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell>{registro.mascota}</TableCell>
                <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                <TableCell><Chip label={registro.tipo} color="primary" /></TableCell>
                <TableCell>{registro.descripcion}</TableCell>
                <TableCell>{registro.veterinario}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleAbrirDetalle(registro)}>Ver detalles</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalle */}
      <Modal open={modalDetalle} onClose={() => setModalDetalle(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6">Detalles del Registro</Typography>
          {registroSeleccionado && (
            <Box mt={2}>
              <Typography><strong>Mascota:</strong> {registroSeleccionado.mascota}</Typography>
              <Typography><strong>Fecha:</strong> {new Date(registroSeleccionado.fecha).toLocaleDateString()}</Typography>
              <Typography><strong>Tipo:</strong> {registroSeleccionado.tipo}</Typography>
              <Typography><strong>Motivo:</strong> {registroSeleccionado.descripcion}</Typography>
              <Typography><strong>Detalles:</strong> {registroSeleccionado.detalles}</Typography>
              <Typography><strong>Observaciones:</strong> {registroSeleccionado.observaciones}</Typography>
              <Typography><strong>Veterinario:</strong> {registroSeleccionado.veterinario}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Modal de Nuevo Registro */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6">Registrar Nuevo Historial</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="ID de Mascota"
              value={nuevoRegistro.mascotaId}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, mascotaId: e.target.value })}
            />
            <TextField
              select
              label="Tipo"
              value={nuevoRegistro.tipo}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, tipo: e.target.value })}
            >
              <MenuItem value="consulta">Consulta</MenuItem>
              <MenuItem value="vacunación">Vacunación</MenuItem>
              <MenuItem value="cirugía">Cirugía</MenuItem>
              <MenuItem value="emergencia">Emergencia</MenuItem>
              <MenuItem value="otros">Otros</MenuItem>
            </TextField>
            <TextField
              label="Motivo"
              value={nuevoRegistro.descripcion}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, descripcion: e.target.value })}
            />
            <TextField
              label="Detalles"
              multiline
              rows={2}
              value={nuevoRegistro.detalles}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, detalles: e.target.value })}
            />
            <TextField
              label="Observaciones"
              multiline
              rows={2}
              value={nuevoRegistro.observaciones}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, observaciones: e.target.value })}
            />
            <Button variant="contained" onClick={handleGuardarNuevo}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default HistorialMascotaPage;
