import { useState } from 'react';
import { Button, Container, TextField, Typography, Select, MenuItem , Box, InputLabel, FormControl, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addUsuario,getUsuarioByCorreo } from '../db/indexedDB';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [tipo, setTipo] = useState<'dueño' | 'veterinario'>('dueño');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nombre || !correo || !contraseña) {
      alert('Por favor completa todos los campos.');
      return;
    }
  
    const existente = await getUsuarioByCorreo(correo);
    if (existente) {
      alert('Ya existe un usuario con este correo.');
      return;
    }
  
    await addUsuario({
      id: Date.now(), // Usa timestamp como ID temporal único
      nombre,
      correo,
      contraseña,
      tipo,
    });
  
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 6, borderRadius:3}}>
        <Typography variant="h4" align="center" gutterBottom>
          Registro de Usuario
        </Typography>
        <TextField fullWidth margin="normal" label="Nombre Completo" variant="outlined" value={nombre} onChange={e => setNombre(e.target.value)} />
        <TextField fullWidth margin="normal" label="Correo" variant="outlined" value={correo} onChange={e => setCorreo(e.target.value)} />
        <TextField fullWidth margin="normal" label="Contraseña" variant="outlined" type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Usuario</InputLabel>
            <Select value={tipo} label ="Tipo de usuario" onChange={e => setTipo(e.target.value as 'dueño' | 'veterinario')}>
              <MenuItem value="dueño">Dueño</MenuItem>
              <MenuItem value="veterinario">Veterinario</MenuItem>
            </Select>
          
        </FormControl>
        <Box mt={3} display="flex" justifyContent={"center"}>
          <Button variant="contained" color="primary" size="large" onClick={handleRegister}>Registrarse</Button>
        </Box>
      </Paper>
    </Container>
  );
}
