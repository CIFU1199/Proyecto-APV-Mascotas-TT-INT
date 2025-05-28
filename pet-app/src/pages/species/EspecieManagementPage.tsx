import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  CircularProgress 
} from '@mui/material';
import { Add, Edit, Delete, ToggleOn, ToggleOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { EspecieService } from '../../api/especieService';

interface Especie {
  ESP_ID: number;
  ESP_NOMBRE: string;
  ESP_DESCRIPCION?: string;
  ESP_ESTADO: 'activo' | 'inactivo';
}

const EspecieManagementPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [loading,setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEspecie, setCurrentEspecie] = useState<Especie | null>(null);
  const [formValues, setFormValues] = useState({
    ESP_NOMBRE: '',
    ESP_DESCRIPCION: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar especies paginadas
  const loadEspecies = async () => {
    setLoading(true);
    try {
      const response = await EspecieService.getEspeciesPaginated({
        page: pagination.page + 1,
        pageSize: pagination.rowsPerPage,
        search: searchTerm,
      });
      setEspecies(response.especies);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEspecies();
  }, [pagination.page, pagination.rowsPerPage, searchTerm]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const handleOpenModal = (especie?: Especie) => {
    if (especie) {
      setCurrentEspecie(especie);
      setFormValues({
        ESP_NOMBRE: especie.ESP_NOMBRE,
        ESP_DESCRIPCION: especie.ESP_DESCRIPCION || '',
      });
    } else {
      setCurrentEspecie(null);
      setFormValues({
        ESP_NOMBRE: '',
        ESP_DESCRIPCION: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async () => {
    try {
      if (currentEspecie) {
        // Actualizar
        await EspecieService.updateEspecie(currentEspecie.ESP_ID, formValues);
        enqueueSnackbar('Especie actualizada correctamente', { variant: 'success' });
      } else {
        // Crear
        await EspecieService.createEspecie(formValues);
        enqueueSnackbar('Especie creada correctamente', { variant: 'success' });
      }
      loadEspecies();
      handleCloseModal();
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await EspecieService.toggleEspecieStatus(id);
      enqueueSnackbar('Estado de especie cambiado', { variant: 'success' });
      loadEspecies();
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await EspecieService.deleteEspecie(id);
      enqueueSnackbar('Especie eliminada correctamente', { variant: 'success' });
      loadEspecies();
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Gestión de Especies"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
            >
              Nueva Especie
            </Button>
          }
        />
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              label="Buscar especies"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <Box textAlign="center" p={2}>
                  <CircularProgress />
                </Box>
              ) : (
              <TableBody>
                {especies.map((especie) => (
                  <TableRow key={especie.ESP_ID}>
                    <TableCell>{especie.ESP_ID}</TableCell>
                    <TableCell>{especie.ESP_NOMBRE}</TableCell>
                    <TableCell>
                      {especie.ESP_DESCRIPCION || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={especie.ESP_ESTADO === 'activo' ? 'Activo' : 'Inactivo'}
                        color={especie.ESP_ESTADO === 'activo' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal(especie)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={especie.ESP_ESTADO === 'activo' ? 'Desactivar' : 'Activar'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(especie.ESP_ID)}
                          >
                            {especie.ESP_ESTADO === 'activo' ? (
                              <ToggleOn color="primary" fontSize="small" />
                            ) : (
                              <ToggleOff color="secondary" fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(especie.ESP_ID)}
                          >
                            <Delete color="error" fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody> 
            )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Filas por página"
          />
        </CardContent>
      </Card>

      {/* Modal para crear/editar */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentEspecie ? 'Editar Especie' : 'Nueva Especie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                label="Nombre de la especie"
                name="ESP_NOMBRE"
                value={formValues.ESP_NOMBRE}
                onChange={(e) =>
                  setFormValues({ ...formValues, ESP_NOMBRE: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size ={{xs:12}}>
              <TextField
                fullWidth
                label="Descripción"
                name="ESP_DESCRIPCION"
                value={formValues.ESP_DESCRIPCION}
                onChange={(e) =>
                  setFormValues({ ...formValues, ESP_DESCRIPCION: e.target.value })
                }
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            {currentEspecie ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EspecieManagementPage;