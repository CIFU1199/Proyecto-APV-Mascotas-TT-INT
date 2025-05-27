import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Avatar,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import { 
  Pets,
  CalendarToday,
  MedicalServices,
  PersonAdd,
  ExitToApp,
  Settings,
  AdminPanelSettings,
  MedicalInformation,
  Person,
  ListAlt,
  Groups
} from '@mui/icons-material';

export default function Dashboard() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = userData?.rol || 0; // 1: Admin, 2: Veterinario, 3: Cliente

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Obtener acciones según el rol
  const getQuickActions = () => {
    const adminActions = [
      { icon: <PersonAdd fontSize="large" />, label: 'Gestionar Usuarios', path: '/register-vet' },
      { icon: <Groups fontSize="large" />, label: 'Crear Especie', path: '/create-species' },
      { icon: <Pets fontSize="large" />, label: 'Registrar Mascota', path: '/register-pet' },
      { icon: <CalendarToday fontSize="large" />, label: 'Crear Cita', path: '/create-appointment' },
      { icon: <ListAlt fontSize="large" />, label: 'Gestionar Citas', path: '/manage-appointments' },
      { icon: <MedicalServices fontSize="large" />, label: 'Historial Médico', path: '/medical-history' }
    ];

    const vetActions = [
      { icon: <Groups fontSize="large" />, label: 'Crear Especie', path: '/create-species' },
      { icon: <ListAlt fontSize="large" />, label: 'Gestionar Citas', path: '/manage-appointments' },
      { icon: <MedicalServices fontSize="large" />, label: 'Historial Médico', path: '/medical-history' }
    ];

    const clientActions = [
      { icon: <Pets fontSize="large" />, label: 'Registrar Mascota', path: '/register-pet' },
      { icon: <CalendarToday fontSize="large" />, label: 'Crear Cita', path: '/create-appointment' }
    ];

    switch(userRole) {
      case 1: return adminActions;
      case 2: return vetActions;
      case 3: return clientActions;
      default: return [];
    }
  };

  // Obtener icono según el rol
  const getRoleIcon = () => {
    switch(userRole) {
      case 1: return <AdminPanelSettings />;
      case 2: return <MedicalInformation />;
      case 3: return <Person />;
      default: return <Person />;
    }
  };

  // Obtener texto del rol
  const getRoleText = () => {
    switch(userRole) {
      case 1: return 'Administrador';
      case 2: return 'Veterinario';
      case 3: return 'Cliente';
      default: return 'Usuario';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Panel de Control
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Bienvenido de vuelta, {userData.nombre || 'Usuario'}
            </Typography>
            <Chip
              icon={getRoleIcon()}
              label={getRoleText()}
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: 'primary.main',
                color: 'text.primary'
              }}
            />
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              fontSize: 24
            }}
          >
            {userData.nombre?.charAt(0) || 'U'}
          </Avatar>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            sx={{ borderRadius: 2 }}
            onClick={() => navigate('/settings')}
          >
            Configuración
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Cerrar Sesión
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        Acciones Rápidas
      </Typography>
      
      {getQuickActions().length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {getQuickActions().map((action, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6
                  }
                }}
                onClick={() => navigate(action.path)}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {action.icon}
                </Box>
                <Typography variant="subtitle1">
                  {action.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No hay acciones disponibles para tu rol
          </Typography>
        </Paper>
      )}

      {/* Contenido específico por rol */}
      {userRole === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Estadísticas de Administrador
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Usuarios Registrados</Typography>
                <Typography variant="h4" color="primary">24</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Mascotas Registradas</Typography>
                <Typography variant="h4" color="primary">156</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Citas Programadas</Typography>
                <Typography variant="h4" color="primary">32</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {userRole === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Próximas Consultas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No hay consultas programadas para hoy
          </Typography>
        </Paper>
      )}

      {userRole === 3 && (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Tus Mascotas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No has registrado mascotas aún
          </Typography>
        </Paper>
      )}

      {/* Sección común a todos los roles */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
          Actividad Reciente
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No hay actividad reciente
        </Typography>
      </Paper>
    </Box>
  );
}