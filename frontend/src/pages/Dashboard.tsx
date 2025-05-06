import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, primary, secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 5
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Bienvenido, {user.nombre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Rol: {user.tipo === 'dueño' ? 'Dueño de Mascota' : 'Veterinario'}
          </Typography>

          <Stack spacing={2} sx={{ width: '100%' }}>
            {user.tipo === 'dueño' && (
              <>
                <Button
                  variant="contained"
                  startIcon={<PetsIcon />}
                  size="large"
                  fullWidth
                  onClick={() => navigate('/mascotas')}
                  sx={{ py: 1.5 }}
                >
                  Registrar Mascotas
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CalendarMonthIcon />}
                  size="large"
                  fullWidth
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
                  startIcon={<ManageSearchIcon />}
                  size="large"
                  fullWidth
                  onClick={() => navigate('/gestion-citas')}
                  sx={{ py: 1.5 }}
                >
                  Gestionar Citas
                </Button>
                <Button
                  variant="contained"
                  startIcon={<HistoryEduIcon />}
                  size="large"
                  fullWidth
                  onClick={() => navigate('/historial')}
                  sx={{ py: 1.5 }}
                >
                  Historial Clínico
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
