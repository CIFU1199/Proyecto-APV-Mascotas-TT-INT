import {
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText ,
  Divider,
  Box,
  Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getMascotasByUsuarioId, addCita, getCitasByUsuarioId } from '../db/indexedDB';
import { Mascota, Cita } from '../types';

interface Props {
  user: {
    id: number;
  };
}

export default function AgendarCita({ user }: Props) {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [mascotaId, setMascotaId] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mascotasData, citasData] = await Promise.all([
          getMascotasByUsuarioId(user.id),
          getCitasByUsuarioId(user.id)
        ]);
        setMascotas(mascotasData);
        setCitas(citasData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };
    cargarDatos();
  }, [user.id]);

  const handleAgendar = async () => {
    try {
      if (!mascotaId || !fecha || !hora) {
        setError('Todos los campos son obligatorios');
        return;
      }

      await addCita({ 
        usuarioId: user.id, 
        mascotaId, 
        fecha, 
        hora
      });
      
      setFecha('');
      setHora('');
      setMascotaId('');
      setError('');
      setSuccess('Cita agendada correctamente');
      
      const nuevasCitas = await getCitasByUsuarioId(user.id);
      setCitas(nuevasCitas);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al agendar la cita');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Agendar Cita
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <FormControl fullWidth margin="normal">
        <InputLabel id="mascota-label">Mascota</InputLabel>
        <Select
          labelId="mascota-label"
          value={mascotaId}
          label="Mascota"
          onChange={(e) => setMascotaId(Number(e.target.value))}
        >
          {mascotas.map((mascota) => (
            <MenuItem key={mascota.id} value={mascota.id}>
              {mascota.nombre} ({mascota.especie})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          type="date"
          margin="normal"
          label="Fecha"
          InputLabelProps={{ shrink: true }}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          fullWidth
          type="time"
          margin="normal"
          label="Hora"
          InputLabelProps={{ shrink: true }}
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <Button 
        variant="contained" 
        onClick={handleAgendar} 
        sx={{ mt: 2 }}
        disabled={!mascotaId || !fecha || !hora}
      >
        Agendar
      </Button>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom>
        Mis Citas Agendadas
      </Typography>
      
      {citas.length === 0 ? (
        <Typography variant="body1">No tienes citas agendadas</Typography>
      ) : (
        <List>
          {citas.map((cita) => {
            const mascota = mascotas.find((m) => m.id === cita.mascotaId);
            return (
              <ListItem key={cita.id} divider>
                <ListItemText 
                  primary={`${mascota?.nombre || 'Mascota no encontrada'}`}
                  secondary={`Fecha: ${cita.fecha} - Hora: ${cita.hora} | Estado: ${cita.estado} | Observacion: ${cita.observacion || 'No especificada'}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Container>
  );
}