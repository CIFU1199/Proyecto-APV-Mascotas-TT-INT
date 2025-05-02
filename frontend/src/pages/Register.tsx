import { useState } from 'react';
import { Button, Container, TextField, Typography, Select, MenuItem } from '@mui/material';
import { addUsuario } from '../db/indexedDB';
import { useNavigate } from 'react-router-dom';

import { getUsuarioByCorreo } from '../db/indexedDB';

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
    <Container>
      <Typography variant="h4">Registrar</Typography>
      <TextField fullWidth margin="normal" label="Name" value={nombre} onChange={e => setNombre(e.target.value)} />
      <TextField fullWidth margin="normal" label="Email" value={correo} onChange={e => setCorreo(e.target.value)} />
      <TextField fullWidth margin="normal" label="Password" type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
      <Select fullWidth margin="dense" value={tipo} onChange={e => setTipo(e.target.value as 'dueño' | 'veterinario')}>
        <MenuItem value="dueño">Dueño</MenuItem>
        <MenuItem value="veterinario">Veterinario</MenuItem>
      </Select>
      <Button variant="contained" onClick={handleRegister}>Register</Button>
    </Container>
  );
}
