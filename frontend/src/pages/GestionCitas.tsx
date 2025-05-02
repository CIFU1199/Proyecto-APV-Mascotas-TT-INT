import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getTodasLasCitas, updateCitaEstado, initDB } from "../db/indexedDB";
import { Cita, Mascota, Usuario} from "../types/index"; // Añadido Usuario en la importación

/* cspell:disable Gestion Citas citas Cita mascotas Mascotas Mascota usuarios Usuarios Usuario cargar Datos Todas Mapeo dueño nombre encontrada registrado Fecha Estado actualizadas actualizando pendiente */

type GestionCitasProps = Record<string, never>;

const GestionCitas: React.FC<GestionCitasProps> = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotasMap, setMascotasMap] = useState<Record<number, Mascota>>({});
  const [usuariosMap, setUsuariosMap] = useState<Record<number, Usuario>>({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const citas = await getTodasLasCitas();
        const db = await initDB();

        // Mapeo de mascotas y usuarios
        const mascotasStore = await db.getAll("mascotas");
        const usuariosStore = await db.getAll("usuarios");

        const mascotas = Object.fromEntries(
          mascotasStore.map((m) => [m.id, m])
        );
        const usuarios = Object.fromEntries(
          usuariosStore.map((u) => [u.id, u])
        );

        setCitas(citas);
        setMascotasMap(mascotas);
        setUsuariosMap(usuarios);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    cargarDatos();
  }, []);

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      await updateCitaEstado(id, estado);
      const actualizadas = await getTodasLasCitas();
      setCitas(actualizadas);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
        Gestión de Citas
      </Typography>
      <List sx={{ bgcolor: "background.paper" }}>
        {citas.map((cita) => {
          const mascota = mascotasMap[cita.mascotaId];
          const dueñoId = mascota?.usuarioId;
          const dueño = dueñoId ? usuariosMap[dueñoId] : undefined;

          return (
            <Box key={cita.id}>
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary={`${mascota?.nombre || "Mascota no encontrada"} - ${
                    dueño?.nombre || "Dueño no registrado"
                  }`}
                  secondary={`Fecha: ${cita.fecha} | Hora: ${cita.hora} | Estado actual: ${cita.estado}`}
                  sx={{ flex: 1 }}
                />
                <Select
                  value={cita.estado}
                  onChange={(e) =>
                    cambiarEstado(cita.id, e.target.value as string)
                  }
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="atendida">Atendida</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </ListItem>
              <Divider component="li" />
            </Box>
          );
        })}
      </List>
    </Container>
  );
};

export default GestionCitas;
