import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  TextField,
  MenuItem,
  Chip,
  Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import HistorialService from '../../api/historialService';

interface RegistroHistorial {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  detalles: string;
  observaciones: string;
  veterinario: string;
}

const HistorialMascotaPage: React.FC = () => {
  const { mascotaId } = useParams<{ mascotaId: string }>();
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [nuevoRegistro, setNuevoRegistro] = useState({
    tipo: '',
    descripcion: '',
    detalles: '',
    observaciones: ''
  });

  useEffect(() => {
    cargarHistorial();
  }, [mascotaId]);

  const cargarHistorial = async () => {
    try {
      const response = await HistorialService.obtenerHistorialMascota(Number(mascotaId));
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const filtrarPorTipo = async (tipo: string) => {
    try {
      if (tipo === 'todos') {
        cargarHistorial();
      } else {
        const response = await HistorialService.filtrarHistorialPorTipo(Number(mascotaId), tipo);
        setHistorial(response.data);
      }
    } catch (error) {
      console.error('Error al filtrar historial:', error);
    }
  };

  const handleCrearRegistro = async () => {
    try {
      await HistorialService.crearRegistroHistorial({
        mascotaId: Number(mascotaId),
        ...nuevoRegistro
      });
      cargarHistorial();
      setNuevoRegistro({
        tipo: '',
        descripcion: '',
        detalles: '',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al crear registro:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Historial Médico
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          select
          label="Filtrar por tipo"
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            filtrarPorTipo(e.target.value);
          }}
          sx={{ width: 200 }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="consulta">Consulta</MenuItem>
          <MenuItem value="vacunación">Vacunación</MenuItem>
          <MenuItem value="cirugía">Cirugía</MenuItem>
          <MenuItem value="emergencia">Emergencia</MenuItem>
        </TextField>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Nuevo Registro
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            select
            label="Tipo"
            value={nuevoRegistro.tipo}
            onChange={(e) => setNuevoRegistro({...nuevoRegistro, tipo: e.target.value})}
          >
            <MenuItem value="consulta">Consulta</MenuItem>
            <MenuItem value="vacunación">Vacunación</MenuItem>
            <MenuItem value="cirugía">Cirugía</MenuItem>
            <MenuItem value="emergencia">Emergencia</MenuItem>
            <MenuItem value="otros">Otros</MenuItem>
          </TextField>
          <TextField
            label="Descripción"
            value={nuevoRegistro.descripcion}
            onChange={(e) => setNuevoRegistro({...nuevoRegistro, descripcion: e.target.value})}
          />
          <TextField
            label="Detalles"
            multiline
            rows={2}
            value={nuevoRegistro.detalles}
            onChange={(e) => setNuevoRegistro({...nuevoRegistro, detalles: e.target.value})}
          />
          <TextField
            label="Observaciones"
            multiline
            rows={3}
            value={nuevoRegistro.observaciones}
            onChange={(e) => setNuevoRegistro({...nuevoRegistro, observaciones: e.target.value})}
          />
          <Button 
            variant="contained" 
            onClick={handleCrearRegistro}
            disabled={!nuevoRegistro.tipo || !nuevoRegistro.descripcion}
          >
            Guardar Registro
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Veterinario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={registro.tipo} color="primary" />
                </TableCell>
                <TableCell>{registro.descripcion}</TableCell>
                <TableCell>{registro.detalles}</TableCell>
                <TableCell>{registro.veterinario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HistorialMascotaPage;