// src/pages/HistorialMascota.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { initDB, getHistorialPorMascota } from '../db/indexedDB';

export default function HistorialMascota() {
  const [mascotas, setMascotas] = useState<{ id: number; nombre: string }[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | ''>('');
  const [historial, setHistorial] = useState<{ id: number; fecha: string; hora: string; estado: string }[]>([]);

  useEffect(() => {
    const cargarMascotas = async () => {
      const db = await initDB();
      const todas = await db.getAll('mascotas');
      setMascotas(todas);
    };
    cargarMascotas();
  }, []);

  const handleSeleccion = async (id: number) => {
    setSeleccionada(id);
    const historial = await getHistorialPorMascota(id);
    setHistorial(historial);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Historial de Atención</Typography>

      <Select
        fullWidth
        value={seleccionada}
        onChange={e => handleSeleccion(Number(e.target.value))}
        displayEmpty
      >
        <MenuItem value="">Seleccione una mascota</MenuItem>
        {mascotas.map((m) => (
          <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
        ))}
      </Select>

      <List>
        {historial.map((cita) => (
          <ListItem key={cita.id}>
            <ListItemText
              primary={`Fecha: ${cita.fecha} | Hora: ${cita.hora}`}
              secondary={`Estado: ${cita.estado}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
