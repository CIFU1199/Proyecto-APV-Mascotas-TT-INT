import { Container, Typography, Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Bienvenido, {user.nombre}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Rol: {user.tipo === 'dueño' ? 'Dueño de mascota' : 'Veterinario'}
        </Typography>

        <Stack spacing={3} sx={{ width: '100%', maxWidth: 400 }}>
          {user.tipo === 'dueño' && (
            <>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/mascotas')}
                sx={{ py: 1.5 }}
              >
                Registrar Mascotas
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/citas')}
                sx={{ py: 1.5 }}
              >
                Agendar Cita
              </Button>
            </>
          )}

          {user.tipo === 'veterinario' && (
            <>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/gestion-citas')}
                sx={{ py: 1.5 }}
              >
                Gestionar Citas
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/historial')}
                sx={{ py: 1.5 }}
              >
                Historial Clínico
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}