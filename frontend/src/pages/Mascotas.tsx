import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, List, ListItem } from '@mui/material';
import { addMascota, getMascotasByUsuarioId } from '../db/indexedDB';

interface Props {
  user: {
    id: number;
  };
}

export default function Mascotas({ user }: Props) {
  const [nombre, setNombre] = useState<string>('');
  const [especie, setEspecie] = useState<string>('');
  const [edad, setEdad] = useState<number>(0);
  const [estado, setEstado] = useState<string>('');
  const [mascotas, setMascotas] = useState<{ 
    id?: number;
    nombre: string; 
    especie: string; 
    edad: number;
    estado?:string;
    usuarioId: number;
  }[]>([]);

  const cargarMascotas = async () => {
    const lista = await getMascotasByUsuarioId(user.id);
    setMascotas(lista);
  };

  useEffect(() => {
    cargarMascotas();
  }, [user.id]);

  const handleAdd = async () => {
    if (!nombre || !especie || !estado) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    await addMascota({ 
      nombre, 
      especie, 
      edad,
      estado, 
      usuarioId: user.id 
    });
    setNombre('');
    setEspecie('');
    setEdad(0);
    setEstado('');
    await cargarMascotas();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Registrar Mascota
      </Typography>
      
      <TextField 
        label="Nombre" 
        fullWidth 
        value={nombre} 
        onChange={e => setNombre(e.target.value)} 
        margin="normal" 
        required
      />
      
      <TextField 
        label="Especie" 
        fullWidth 
        value={especie} 
        onChange={e => setEspecie(e.target.value)} 
        margin="normal" 
        required
      />
      
      <TextField 
        label="Edad" 
        fullWidth 
        type="number" 
        value={edad || ''} 
        onChange={e => setEdad(Number(e.target.value))} 
        margin="normal" 
        inputProps={{ min: 0 }}
      />
      <TextField 
        label="Estado de la Mascota"
        fullWidth
        multiline
        minRows={3}
        value={estado}
        onChange={e => setEstado(e.target.value)}
        margin="normal"
        required
      />
      
      
      <Button 
        variant="contained" 
        onClick={handleAdd}
        sx={{ mt: 2 }}
      >
        Registrar
      </Button>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Mis Mascotas
      </Typography>
      
      <List>
        {mascotas.map((mascota, index) => (
          <ListItem key={mascota.id || index}>
            {mascota.nombre} ({mascota.especie}) - {mascota.edad} años - Estado: {mascota.estado || 'N/A'}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}