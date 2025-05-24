// src/pages/pets/RegisterPet.tsx
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { Pets, Female, Male, Cake, Scale, Palette, PhotoCamera } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { PetService } from '../../api/petService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function RegisterPet() {
  const { control, handleSubmit, reset } = useForm();
  const [species, setSpecies] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState({
    species: true,
    pets: true,
    submitting: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar especies y mascotas al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [speciesData, petsData] = await Promise.all([
          PetService.getSpecies(),
          PetService.getUserPets()
        ]);
        setSpecies(speciesData);
        setUserPets(petsData);
        setLoading({ ...loading, species: false, pets: false });
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading({ ...loading, species: false, pets: false });
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data) => {
    setLoading({ ...loading, submitting: true });
    setError('');
    setSuccess('');
    
    try {
      // Formatear fecha para el backend
      const formattedData = {
        ...data,
        MACT_FECHA_NACIMIENTO: format(new Date(data.MACT_FECHA_NACIMIENTO), 'yyyy-MM-dd')
      };
      
      const response = await PetService.registerPet(formattedData);
      setSuccess(response.messaje);
      reset();
      
      // Actualizar lista de mascotas
      const updatedPets = await PetService.getUserPets();
      setUserPets(updatedPets);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la mascota');
    } finally {
      setLoading({ ...loading, submitting: false });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Formulario de registro */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Pets sx={{ mr: 1 }} /> Registrar Nueva Mascota
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="MACT_NOMBRE"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Nombre es requerido' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre de la mascota"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="ESP_ID"
                    control={control}
                    rules={{ required: 'Especie es requerida' }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Especie</InputLabel>
                        <Select
                          {...field}
                          label="Especie"
                          disabled={loading.species}
                        >
                          {loading.species ? (
                            <MenuItem disabled>Cargando especies...</MenuItem>
                          ) : (
                            species.map((specie) => (
                              <MenuItem key={specie.ESP_ID} value={specie.ESP_ID}>
                                {specie.ESP_NOMBRE}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {fieldState.error && (
                          <Typography variant="caption" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="MACT_SEXO"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Sexo es requerido' }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Sexo</InputLabel>
                        <Select {...field} label="Sexo">
                          <MenuItem value="Macho">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Male sx={{ mr: 1 }} /> Macho
                            </Box>
                          </MenuItem>
                          <MenuItem value="Hembra">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Female sx={{ mr: 1 }} /> Hembra
                            </Box>
                          </MenuItem>
                        </Select>
                        {fieldState.error && (
                          <Typography variant="caption" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="MACT_FECHA_NACIMIENTO"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Fecha de nacimiento es requerida' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Fecha de nacimiento"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <Cake sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="MACT_RAZA"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Raza es requerida' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Raza"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="MACT_PESO"
                    control={control}
                    defaultValue=""
                    rules={{ 
                      required: 'Peso es requerido',
                      min: { value: 0.1, message: 'Peso mínimo 0.1 kg' }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Peso (kg)"
                        type="number"
                        inputProps={{ step: "0.1", min: "0.1" }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <Scale sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="MACT_COLOR"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Color es requerido' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Color"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <Palette sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="MACT_FOTO"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera />}
                      >
                        Subir Foto
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </Button>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading.submitting}
                    startIcon={loading.submitting ? <CircularProgress size={20} /> : null}
                  >
                    {loading.submitting ? 'Registrando...' : 'Registrar Mascota'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Listado de mascotas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Mis Mascotas Registradas
            </Typography>
            
            {loading.pets ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : userPets.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No tienes mascotas registradas aún.
              </Typography>
            ) : (
              <List>
                {userPets.map((pet) => (
                  <ListItem 
                    key={pet.MACT_ID} 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      } 
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Pets />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={pet.MACT_NOMBRE}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            {pet.Especie.ESP_NOMBRE} • {pet.MACT_RAZA}
                          </Typography>
                          <Typography component="span" variant="body2" display="block">
                            {pet.MACT_SEXO} • {pet.edad} • {pet.MACT_PESO} kg
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}