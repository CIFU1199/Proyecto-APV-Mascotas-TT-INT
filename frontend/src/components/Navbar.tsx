import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Divider,
  Button,
  useMediaQuery,
  Theme
} from '@mui/material';
import { Menu, Logout, AccountCircle } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/index';

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePath, setActivePath] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // Cerrar drawer al cambiar de ruta
  useEffect(() => {
    setDrawerOpen(false);
    setActivePath(location.pathname);
  }, [location]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <AppBar position="static" >
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <Menu />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            APV Mascotas
          </Typography>

          {user && !isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <AccountCircle sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  {user.nombre} ({user.tipo})
                </Typography>
              </Box>
              
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/dashboard')}
                sx={{ fontWeight: activePath === '/dashboard' ? 'bold' : 'normal' }}
              >
                Inicio
              </Button>
              
              {user.tipo === 'dueño' && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/mascotas')}
                    sx={{ fontWeight: activePath === '/mascotas' ? 'bold' : 'normal' }}
                  >
                    Mascotas
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/citas')}
                    sx={{ fontWeight: activePath === '/citas' ? 'bold' : 'normal' }}
                  >
                    Citas
                  </Button>
                </>
              )}

              {user.tipo === 'veterinario' && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/gestion-citas')}
                    sx={{ fontWeight: activePath === '/gestion-citas' ? 'bold' : 'normal' }}
                  >
                    Citas
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => handleNavigation('/historial')}
                    sx={{ fontWeight: activePath === '/historial' ? 'bold' : 'normal' }}
                  >
                    Historial
                  </Button>
                </>
              )}

              <Button 
                color="inherit" 
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Salir
              </Button>
            </Box>
          )}

          {user && isMobile && (
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<Logout />}
            >
              Salir
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {user && (
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <AccountCircle sx={{ mr: 1, fontSize: 40 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.nombre}
                </Typography>
                <Typography variant="body2">
                  {user.tipo === 'dueño' ? 'Dueño' : 'Veterinario'}
                </Typography>
              </Box>
            </Box>
          )}
          <Divider />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavigation('/dashboard')}
                selected={activePath === '/dashboard'}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            {user?.tipo === 'dueño' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => handleNavigation('/mascotas')}
                    selected={activePath === '/mascotas'}
                  >
                    <ListItemText primary="Mis Mascotas" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => handleNavigation('/citas')}
                    selected={activePath === '/citas'}
                  >
                    <ListItemText primary="Mis Citas" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {user?.tipo === 'veterinario' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => handleNavigation('/gestion-citas')}
                    selected={activePath === '/gestion-citas'}
                  >
                    <ListItemText primary="Gestionar Citas" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => handleNavigation('/historial')}
                    selected={activePath === '/historial'}
                  >
                    <ListItemText primary="Historial Clínico" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}