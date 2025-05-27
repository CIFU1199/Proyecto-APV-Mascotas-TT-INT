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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Box,
  Avatar,
  Divider,
  Stack,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import GestionCitaService, { type CitaDetalles } from '../../api/gestionCitaService';
import { useSnackbar } from 'notistack';


const GestionCitasPage: React.FC = () => {
  const [citas, setCitas] = useState<CitaDetalles[]>([]);
  const [filtros, setFiltros] = useState({
    fecha: null as Date | null,
    estado: '',
    tipo: ''
  });
  const [openModal, setOpenModal] = useState(false);
  const [accion, setAccion] = useState<'cancelar' | 'reprogramar' | 'atender' | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDetalles | null>(null);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [observacion, setObservacion] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await GestionCitaService.obtenerCitasCompletas();
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      enqueueSnackbar('Error al cargar citas', { variant: 'error' });
    }
  };

  const aplicarFiltros = async () => {
    try {
      const params = {
        estado: filtros.estado,
        tipo: filtros.tipo,
        fecha: filtros.fecha ? format(filtros.fecha, 'yyyy-MM-dd') : undefined
      };
      
      const response = await GestionCitaService.filtrarCitas(params);
      setCitas(response.data || []);
      
      if (response.data.length === 0) {
        enqueueSnackbar('No se encontraron citas con los filtros aplicados', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error al filtrar citas:', error);
      setCitas([]);
      enqueueSnackbar('Error al filtrar citas', { variant: 'error' });
    }
  };

  /*
const abrirModal = async (cita: CitaDetalles, accion: 'cancelar' | 'atender') => {
  setCargandoDetalles(true);
  try {
    setCitaSeleccionada(cita);
    setAccion(accion);

    // Cargar detalles completos si no están disponibles
    if (!cita.mascota?.sexo || !cita.mascota?.edad) {
      const response = await GestionCitaService.obtenerDetallesCita(cita.id);
      setCitaSeleccionada(response.data);
    }

    setOpenModal(true);
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    enqueueSnackbar('Error al cargar detalles de la cita', { variant: 'error' });
  } finally {
    setCargandoDetalles(false);
  }
};

*/
  const handleAccion = async () => {
    if (!citaSeleccionada) return;

    try {
      switch (accion) {
        case 'cancelar':
          await GestionCitaService.cancelarCita(citaSeleccionada.id, observacion);
          enqueueSnackbar('Cita cancelada exitosamente', { variant: 'success' });
          break;
        case 'atender':
          await GestionCitaService.atenderCita(citaSeleccionada.id, observacion);
          enqueueSnackbar('Cita marcada como atendida', { variant: 'success' });
          break;
      }
      cargarCitas();
      setOpenModal(false);
      setObservacion('');
    } catch (error) {
      console.error('Error al realizar acción:', error);
      enqueueSnackbar('Error al procesar la acción', { variant: 'error' });
    }
  };

const renderModalContent = () => {
  if (!citaSeleccionada) return null;

  return (
    <Box>
      {cargandoDetalles ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" component="div" gutterBottom sx={{ mt: 2 }}>
            Detalles de la Cita
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid size={{xs:12,md:12}}>
              <Typography variant="subtitle1" component="div" gutterBottom>
                Información de la Mascota
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                {citaSeleccionada.mascota.foto && (
                  <Avatar 
                    src={citaSeleccionada.mascota.foto} 
                    alt={citaSeleccionada.mascota.nombre}
                    sx={{ width: 80, height: 80 }}
                  />
                )}
                <Box component="div">
                  <Typography component="div"><strong>Nombre:</strong> {citaSeleccionada.mascota.nombre}</Typography>
                  <Typography component="div"><strong>Especie:</strong> {citaSeleccionada.mascota.especie}</Typography>
                  <Typography component="div"><strong>Sexo:</strong> {citaSeleccionada.mascota.sexo || 'No especificado'}</Typography>
                </Box>
              </Stack>
              <Typography component="div"><strong>Edad:</strong> {citaSeleccionada.mascota.edad || 'Desconocida'}</Typography>
              <Typography component="div"><strong>Raza:</strong> {citaSeleccionada.mascota.raza || 'Desconocida'}</Typography>
              <Typography component="div"><strong>Color:</strong> {citaSeleccionada.mascota.color || 'Desconocido'}</Typography>
              <Typography component="div"><strong>Peso:</strong> {citaSeleccionada.mascota.peso ? `${citaSeleccionada.mascota.peso} kg` : 'Desconocido'}</Typography>
            </Grid>

            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle1" component="div" gutterBottom>
                Detalles de la Cita
              </Typography>
              <Typography component="div"><strong>Fecha:</strong> {new Date(citaSeleccionada.fecha).toLocaleDateString()}</Typography>
              <Typography component="div"><strong>Hora:</strong> {citaSeleccionada.hora}</Typography>
              <Typography component="div"><strong>Tipo:</strong> {citaSeleccionada.tipo}</Typography>
              
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                <Typography component="span"><strong>Estado:</strong></Typography>
                <Chip 
                  label={citaSeleccionada.estado} 
                  color={
                    citaSeleccionada.estado === 'Atendida' ? 'success' : 
                    citaSeleccionada.estado === 'Cancelada' ? 'error' : 
                    'primary'
                  } 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              
              <Typography component="div"><strong>Motivo:</strong> {citaSeleccionada.motivo || 'No especificado'}</Typography>
              <Typography component="div"><strong>Veterinario asignado:</strong> {citaSeleccionada.veterinario?.nombre || 'No asignado'}</Typography>
              
              {citaSeleccionada.observacionMedica && (
                <>
                  <Typography variant="subtitle1" component="div" gutterBottom sx={{ mt: 2 }}>
                    Observación Médica Actual
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Typography component="div">{citaSeleccionada.observacionMedica}</Typography>
                  </Paper>
                </>
              )}
            </Grid>
          </Grid>

          <Typography variant="subtitle1" component="div" gutterBottom sx={{ mt: 3 }}>
            {accion === 'cancelar' ? 'Motivo de Cancelación' : 'Observación Médica'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder={accion === 'cancelar' 
              ? 'Ingrese el motivo de cancelación...' 
              : 'Ingrese las observaciones médicas...'}
          />
        </>
      )}
    </Box>
  );
};


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 3 }}>
          Gestión de Citas
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size ={{xs:12, md:4}} >
              <DatePicker
                label="Filtrar por fecha"
                value={filtros.fecha}
                onChange={(newValue) => setFiltros({...filtros, fecha: newValue})}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    error={!!filtros.fecha && citas.length === 0}
                    helperText={!!filtros.fecha && citas.length === 0 ? 'No hay citas en esta fecha' : ''}
                  />
                )}
              />
            </Grid>
            <Grid size ={{xs:12, md:4}} >
              <TextField
                select
                label="Estado"
                fullWidth
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Confirmada">Confirmada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
                <MenuItem value="Atendida">Atendida</MenuItem>
              </TextField>
            </Grid>
            <Grid size ={{xs:12, md:4}} >
              <Button 
                variant="contained" 
                onClick={aplicarFiltros}
                fullWidth
                sx={{ height: '56px' }}
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mascota</TableCell>
                <TableCell>Especie</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron citas
                  </TableCell>
                </TableRow>
              ) : (
                citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>{cita.mascota?.nombre || 'Sin nombre'}</TableCell>
                    <TableCell>{cita.mascota?.especie || 'Sin especie'}</TableCell>
                    <TableCell>{cita.fecha ? new Date(cita.fecha).toLocaleDateString() : 'Sin fecha'}</TableCell>
                    <TableCell>{cita.hora || 'Sin hora'}</TableCell>
                    <TableCell>{cita.tipo || 'Sin tipo'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={cita.estado || 'Sin estado'} 
                        color={
                          cita.estado === 'Atendida' ? 'success' : 
                          cita.estado === 'Cancelada' ? 'error' : 
                          'primary'
                        } 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setCitaSeleccionada(cita);
                            setAccion('cancelar');
                            setOpenModal(true);
                          }}
                          disabled={cita.estado === 'Cancelada' || cita.estado === 'Atendida'}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          color="success"
                          onClick={() => {
                            setCitaSeleccionada(cita);
                            setAccion('atender');
                            setOpenModal(true);
                          }}
                          disabled={cita.estado === 'Atendida'}
                        >
                          Atender
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={openModal} 
          onClose={() => {
            setOpenModal(false);
            setObservacion('');
          }} 
          fullWidth 
          maxWidth="md"
        >
          <DialogTitle>
            {accion === 'cancelar' ? 'Cancelar Cita' : 'Atender Cita'}
            <Typography variant="subtitle2" color="text.secondary">
              ID: {citaSeleccionada?.id}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {renderModalContent()}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => {
                setOpenModal(false);
                setObservacion('');
              }} 
              variant="outlined"
            >
              Cerrar
            </Button>
            <Button 
              onClick={handleAccion} 
              variant="contained"
              color={accion === 'cancelar' ? 'error' : 'success'}
              disabled={!observacion.trim() || cargandoDetalles}
            >
              {accion === 'cancelar' ? 'Confirmar Cancelación' : 'Registrar Atención'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default GestionCitasPage;