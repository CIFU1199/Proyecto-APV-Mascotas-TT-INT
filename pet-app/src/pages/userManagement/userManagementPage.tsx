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
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UserAdminService, ROLES, getRolNombre } from '../../api/auth/userAdminService';

interface Usuario {
  id: number;
  documento: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: number;
  estado: boolean;
}

const UserManagementPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0,
  });
  const [filtros, setFiltros] = useState({
    rol: undefined as number | undefined,
    busqueda: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  // Formulario
  const [formValues, setFormValues] = useState({
    documento: '',
    nombres: '',
    correo: '',
    telefono: '',
    rol: ROLES.VETERINARIO,
    estado: true,
    password: ''
  });

  // Obtener lista de usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const params = {
        pagina: pagination.page + 1,
        porPagina: pagination.rowsPerPage,
        rol: filtros.rol,
        busqueda: filtros.busqueda,
      };
      
      const response = await UserAdminService.listarUsuarios(params);
      setUsuarios(response.usuarios);
      setPagination(prev => ({
        ...prev,
        total: response.totalUsuarios,
      }));
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [pagination.page, pagination.rowsPerPage, filtros]);

  // Manejar cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Registrar nuevo usuario
  const handleRegister = async () => {
    try {
      await UserAdminService.registrarUsuario({
        USUA_DOCUMENTO: formValues.documento,
        USUA_NOMBRES: formValues.nombres,
        USUA_CORREO: formValues.correo,
        USUA_PASSWORD: formValues.password,
        USUA_TELEFONO: formValues.telefono,
        ROL_ID: formValues.rol,
      });
      handleCloseModal();
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error al registrar usuario:', error.message);
    }
  };

  // Actualizar usuario existente
  const handleUpdate = async () => {
    if (!editingId) return;
    
    try {
      await UserAdminService.actualizarUsuario(editingId, {
        documento: formValues.documento,
        nombres: formValues.nombres,
        correo: formValues.correo,
        telefono: formValues.telefono,
        rol: formValues.rol,
        estado: formValues.estado,
      });
      handleCloseModal();
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error.message);
    }
  };

  // Editar usuario
  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setCurrentUser(usuario);
    setFormValues({
      documento: usuario.documento,
      nombres: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      rol: usuario.rol,
      estado: usuario.estado,
      password: ''
    });
    setModalOpen(true);
  };

  // Abrir modal para nuevo usuario
  const handleNewUser = () => {
    setEditingId(null);
    setCurrentUser(null);
    setFormValues({
      documento: '',
      nombres: '',
      correo: '',
      telefono: '',
      rol: ROLES.VETERINARIO,
      estado: true,
      password: ''
    });
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Obtener color según rol
  const getRolColor = (rol: number) => {
    switch (rol) {
      case ROLES.ADMINISTRADOR: return 'error';
      case ROLES.VETERINARIO: return 'primary';
      case ROLES.CLIENTE: return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Gestión de Usuarios"
          action={
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleNewUser}
            >
              Nuevo Usuario
            </Button>
          }
        />
        <CardContent>
          {/* Filtros */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar usuarios"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              sx={{ width: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Filtrar por rol</InputLabel>
              <Select
                value={filtros.rol || ''}
                onChange={(e) => setFiltros({...filtros, rol: Number(e.target.value) || undefined})}
                label="Filtrar por rol"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={ROLES.ADMINISTRADOR}>Administradores</MenuItem>
                <MenuItem value={ROLES.VETERINARIO}>Veterinarios</MenuItem>
                <MenuItem value={ROLES.CLIENTE}>Clientes</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="outlined"
              onClick={() => setFiltros({rol: undefined, busqueda: ''})}
            >
              Limpiar
            </Button>
          </Stack>

          {/* Tabla de usuarios */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.documento}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getRolNombre(usuario.rol)} 
                        color={getRolColor(usuario.rol)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={usuario.estado ? 'Activo' : 'Inactivo'} 
                        color={usuario.estado ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small"
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </CardContent>
      </Card>

      {/* Modal para registro/edición */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? `Editar Usuario ${currentUser?.nombre}` : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12,sm:6}} >
              <TextField
                fullWidth
                label="Documento"
                name="documento"
                value={formValues.documento}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Nombres Completos"
                name="nombres"
                value={formValues.nombres}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formValues.correo}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formValues.telefono}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  label="Rol"
                  name="rol"
                  value={formValues.rol}
                  onChange={(e) => setFormValues({...formValues, rol: Number(e.target.value)})}
                  required
                >
                  <MenuItem value={ROLES.ADMINISTRADOR}>Administrador</MenuItem>
                  <MenuItem value={ROLES.VETERINARIO}>Veterinario</MenuItem>
                  <MenuItem value={ROLES.CLIENTE}>Cliente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!editingId && (
              <Grid size={{xs:12,sm:6}}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
            )}
            {editingId && (
              <Grid size={{xs:12}}>
                <FormControlLabel
                  control={
                    <Switch
                      name="estado"
                      checked={formValues.estado}
                      onChange={handleFormChange}
                    />
                  }
                  label="Estado activo"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={editingId ? handleUpdate : handleRegister}
          >
            {editingId ? 'Actualizar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;