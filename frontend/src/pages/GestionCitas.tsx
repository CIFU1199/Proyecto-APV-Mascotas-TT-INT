import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getTodasLasCitas, updateCitaEstado, initDB } from "../db/indexedDB";
import { Cita, Mascota, Usuario} from "../types/index"; // Añadido Usuario en la importación
import { User } from '../types/index';

//type GestionCitasProps = Record<string, never>;

interface Props {
  user: User;
}

const GestionCitas: React.FC<Props> = ({ user }) =>  {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotasMap, setMascotasMap] = useState<Record<number, Mascota>>({});
  const [usuariosMap, setUsuariosMap] = useState<Record<number, Usuario>>({});
  const [observaciones, setObservaciones] = useState<Record<number, string>>({});

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

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    const observacion = observaciones[id]?.trim();
    
    if ((nuevoEstado === "atendida" || nuevoEstado === "cancelada") && !observacion){
      alert("Debe ingresar una observación para cambiar el estado.");
      return;
    }
    
    try {
      await updateCitaEstado(id, nuevoEstado, observacion || "");
      const actualizadas = await getTodasLasCitas();
      setCitas(actualizadas);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
        Gestión de Citas
      </Typography>
      <p>{user.nombre}</p>
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
                  secondary={
                    <>
                      {`Fecha: ${cita.fecha} | Hora: ${cita.hora} | Estado actual: ${cita.estado}`} <br />
                      {`Estado de la mascota : ${mascota?.estado || "No especificado"}`}
                    </>
                  }
                  sx={{ flex: 1 }}
                />
                <TextField 
                  label = "Observacíon"
                  value={observaciones[cita.id] ?? cita.observacion ?? ""}
                  multiline
                  onChange={(e)=>
                    setObservaciones((prev) => ({
                      ...prev,
                      [cita.id]: e.target.value,
                    }))
                  }
                  sx={{mr:2, width: 200}}
                  size="small"
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
