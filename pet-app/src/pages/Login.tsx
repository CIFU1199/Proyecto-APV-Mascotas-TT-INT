import { 
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Grid
} from '@mui/material';
import { 
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/authService';
import { useAuth } from '../context/AuthContext';



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues:{
      email:'',
      password:''
    }
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { token, userId, nombre, rol } = await AuthService.login(data.email, data.password);
      login(token, { userId, nombre, rol });
      navigate('/dashboard');
    } catch (err: any) {
      const mensaje = err.message || 'Error al iniciar sesión';
      setError(mensaje);

      // Oculta el mensaje 
      setTimeout(() => {
        setError('');
      },3000);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: { xs: 3, sm: 4 },
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', mt: 1 }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico no válido'
              }
            })}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              }
            })}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              borderRadius: 2
            }}
          >
            Iniciar Sesión
          </Button>

          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2" 
                underline="hover"
                sx={{ display: 'block', textAlign: { xs: 'center', sm: 'left' } }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2" 
                underline="hover"
                sx={{ display: 'block', textAlign: { xs: 'center', sm: 'right' } }}
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}