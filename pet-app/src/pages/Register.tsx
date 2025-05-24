import { 
  Container, 
  Paper, 
  Avatar, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Link,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Lock, Person, Email, Phone, Badge } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthService } from '../api/authService';
import { useState } from 'react';

export default function Register(){
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        formState:{errors}
    }= useForm({
    defaultValues:{    
        USUA_DOCUMENTO:'',
        USUA_NOMBRES:'',
        USUA_CORREO:'',
        USUA_PASSWORD:'',
        USUA_TELEFONO:''
    }
    })

    const onSubmit = async (data: any)=>{
        try{
            await AuthService.register(data);
            setSuccess(true);
            setTimeout(()=> navigate('/login'), 2000);
        }catch(err: any){
            setError(err.message);
        }
    }
    return (
    <Container component="main" maxWidth="sm">
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
          <Lock />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Registro de Usuario
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
            ¡Registro exitoso! Redirigiendo al login...
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="USUA_DOCUMENTO"
            label="Documento de Identidad"
            autoComplete="off"
            error={!!errors.USUA_DOCUMENTO}
            helperText={errors.USUA_DOCUMENTO?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge color="action" />
                </InputAdornment>
              ),
            }}
            {...register('USUA_DOCUMENTO', {
              required: 'Documento es requerido',
              pattern: {
                value: /^[0-9]{6,12}$/,
                message: 'Documento no válido (solo números)'
              }
            })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="USUA_NOMBRES"
            label="Nombres Completos"
            autoComplete="name"
            error={!!errors.USUA_NOMBRES}
            helperText={errors.USUA_NOMBRES?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            {...register('USUA_NOMBRES', {
              required: 'Nombres son requeridos',
              minLength: {
                value: 5,
                message: 'Mínimo 5 caracteres'
              }
            })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="USUA_CORREO"
            label="Correo Electrónico"
            autoComplete="email"
            error={!!errors.USUA_CORREO}
            helperText={errors.USUA_CORREO?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            {...register('USUA_CORREO', {
              required: 'Correo es requerido',
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
            id="USUA_PASSWORD"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            error={!!errors.USUA_PASSWORD}
            helperText={errors.USUA_PASSWORD?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
            {...register('USUA_PASSWORD', {
              required: 'Contraseña es requerida',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              }
            })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="USUA_TELEFONO"
            label="Teléfono"
            autoComplete="tel"
            error={!!errors.USUA_TELEFONO}
            helperText={errors.USUA_TELEFONO?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
            {...register('USUA_TELEFONO', {
              required: 'Teléfono es requerido',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Teléfono debe tener 10 dígitos'
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
            Registrarse
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2" 
                underline="hover"
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}