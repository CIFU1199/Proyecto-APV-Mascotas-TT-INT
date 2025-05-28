import React, { useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format,parse} from 'date-fns';
import { es } from "date-fns/locale/es";
import type { SelectChangeEvent } from "@mui/material/Select";

import {
  obtenerMascotasUsuario,
  registrarCita,
  obtenerCitasUsuario,
  type Mascota,
  type Cita,
  type NuevaCita,
} from "../../api/CitaService"; // Nota la "s" al final

const CitasPage: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<NuevaCita>({
    MACT_ID: 0,
    CIT_FECHACITA: "",
    CIT_HORA: "08:00:00",
    CIT_DURACION: 30,
    CIT_TIPO: "consulta",
    CIT_MOTIVOCITA: "",
  });

  const [errors, setErrors] = useState({
    MACT_ID: "",
    CIT_FECHACITA: "",
    CIT_HORA: "",
    CIT_MOTIVOCITA: "",
  });

  //const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mascotasData, citasData] = await Promise.all([
          obtenerMascotasUsuario(),
          obtenerCitasUsuario(),
        ]);
        setMascotas(mascotasData);
        setCitas(citasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar datos. Por favor, inténtalo de nuevo.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      MACT_ID: 0,
      CIT_FECHACITA: "",
      CIT_HORA: "08:00:00",
      CIT_DURACION: 30,
      CIT_TIPO: "consulta",
      CIT_MOTIVOCITA: "",
    });
    setErrors({
      MACT_ID: "",
      CIT_FECHACITA: "",
      CIT_HORA: "",
      CIT_MOTIVOCITA: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name as string]: "",
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData((prev) => ({
        ...prev,
        CIT_FECHACITA: formattedDate,
      }));
      setErrors((prev) => ({
        ...prev,
        CIT_FECHACITA: "",
      }));
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      const formattedTime = format(time, "HH:mm:ss");
      setFormData((prev) => ({
        ...prev,
        CIT_HORA: formattedTime,
      }));
      setErrors((prev) => ({
        ...prev,
        CIT_HORA: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      MACT_ID: "",
      CIT_FECHACITA: "",
      CIT_HORA: "",
      CIT_MOTIVOCITA: "",
    };

    if (!formData.MACT_ID) {
      newErrors.MACT_ID = "Selecciona una mascota";
      valid = false;
    }

    if (!formData.CIT_FECHACITA) {
      newErrors.CIT_FECHACITA = "Selecciona una fecha";
      valid = false;
    }

    if (!formData.CIT_HORA) {
      newErrors.CIT_HORA = "Selecciona una hora";
      valid = false;
    }

    if (!formData.CIT_MOTIVOCITA) {
      newErrors.CIT_MOTIVOCITA = "Ingresa el motivo de la cita";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await registrarCita(formData);
      setSnackbar({
        open: true,
        message: "Cita registrada exitosamente",
        severity: "success",
      });
      const updatedCitas = await obtenerCitasUsuario();
      setCitas(updatedCitas);
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error al registrar cita:", error);
      let errorMessage = "Error al registrar la cita";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: Number(value),
    }));
    setErrors((prev) => ({
      ...prev,
      [name as string]: "",
    }));
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mis Citas
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ mb: 3 }}
        >
          Agendar Nueva Cita
        </Button>

        {loading && citas.length === 0 ? (
          <Typography>Cargando citas...</Typography>
        ) : citas.length === 0 ? (
          <Typography>No tienes citas programadas</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mascota</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Veterinario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {cita.mascota.foto && (
                          <img
                            src={cita.mascota.foto}
                            alt={cita.mascota.nombre}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              marginRight: 10,
                            }}
                          />
                        )}
                        <Box>
                          <Typography>{cita.mascota.nombre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cita.mascota.especie}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(cita.fecha)}</TableCell>
                    <TableCell>{formatTime(cita.hora)}</TableCell>
                    <TableCell>{cita.tipo}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            cita.estado === "Pendiente"
                              ? "orange"
                              : cita.estado === "Atendida"
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {cita.estado}
                      </Typography>
                    </TableCell>
                    <TableCell>{cita.motivo}</TableCell>
                    <TableCell>{cita.veterinario.nombre}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog para nueva cita */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Agendar Nueva Cita</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <FormControl fullWidth margin="normal" error={!!errors.MACT_ID}>
                <InputLabel id="mascota-label">Mascota</InputLabel>
                <Select
                  labelId="mascota-label"
                  id="MACT_ID"
                  name="MACT_ID"
                  value={formData.MACT_ID.toString()}
                  label="Mascota"
                  onChange={handleSelectChange}
                >
                  <MenuItem value={0}>Selecciona una mascota</MenuItem>
                  {mascotas.map((mascota) => (
                    <MenuItem
                      key={mascota.MACT_ID}
                      value={mascota.MACT_ID.toString()}
                    >
                      {mascota.MACT_NOMBRE}
                    </MenuItem>
                  ))}
                </Select>
                {errors.MACT_ID && (
                  <Typography color="error" variant="caption">
                    {errors.MACT_ID}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.CIT_FECHACITA}
                >
                  <DatePicker
                    label="Fecha de la cita"
                    value={
                      formData.CIT_FECHACITA
                        ? parse(formData.CIT_FECHACITA)
                        : null
                    }
                    onChange={handleDateChange}
                    minDate={new Date()}
                    format="dd/MM/yyyy"
                  />
                  {errors.CIT_FECHACITA && (
                    <Typography color="error" variant="caption">
                      {errors.CIT_FECHACITA}
                    </Typography>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.CIT_HORA}
                >
                  <TimePicker
                    label="Hora de la cita"
                    value={
                      formData.CIT_HORA
                        ? parse(formData.CIT_HORA)
                        : null
                    }
                    onChange={handleTimeChange}
                    minutesStep={15}
                  />
                  {errors.CIT_HORA && (
                    <Typography color="error" variant="caption">
                      {errors.CIT_HORA}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel id="tipo-label">Tipo de cita</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="CIT_TIPO"
                  name="CIT_TIPO"
                  value={formData.CIT_TIPO}
                  label="Tipo de cita"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="consulta">Consulta</MenuItem>
                  <MenuItem value="vacunacion">Vacunación</MenuItem>
                  <MenuItem value="cirugia">Cirugía</MenuItem>
                  <MenuItem value="emergencia">Emergencia</MenuItem>
                  <MenuItem value="estética">Estética</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                id="CIT_MOTIVOCITA"
                name="CIT_MOTIVOCITA"
                label="Motivo de la cita"
                value={formData.CIT_MOTIVOCITA}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.CIT_MOTIVOCITA}
                helperText={errors.CIT_MOTIVOCITA}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Cita"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity as any}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default CitasPage;
