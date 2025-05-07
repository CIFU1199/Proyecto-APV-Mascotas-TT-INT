import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Avatar,
  Grid,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon
} from '@mui/icons-material';
import { getUsuarioByCorreo } from '../db/indexedDB';
import { User } from '../types';




interface LoginProps {
  onLogin: (user: User) => void;
}



export default function Login({ onLogin }: LoginProps) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo || !contraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);

    try {
      const usuario = await getUsuarioByCorreo(correo);

      if (!usuario) {
        setError('Correo no registrado');
        return;
      }

      if (usuario.contraseña !== contraseña) {
        setError('Contraseña incorrecta');
        return;
      }

      onLogin({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        contraseña: usuario.contraseña,
        tipo: usuario.tipo
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                Iniciando Sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>

          <Grid container>
            <Grid spacing={{xs:0}} >
              <Link href="#" variant="body2" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid >
              <Link href="/register" variant="body2" underline="hover">
                ¿No tienes cuenta? Regístrate
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}