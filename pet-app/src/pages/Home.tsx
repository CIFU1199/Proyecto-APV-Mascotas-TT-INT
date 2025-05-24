import { Container, Typography, Button, Grid, Box } from "@mui/material";
import { Pets, MedicalServices, Emergency, Healing, Spa, MoreHoriz } from "@mui/icons-material";
import { Link } from "react-router-dom";
import BannerCarousel from '../components/BannerCarousel';


const services = [
  { name: "Consulta", icon: <Pets fontSize="large" />, description: "Revisiones generales y diagnósticos." },
  { name: "Vacunación", icon: <MedicalServices fontSize="large" />, description: "Vacunas para todas las edades." },
  { name: "Emergencia", icon: <Emergency fontSize="large" />, description: "Atención inmediata 24/7." },
  { name: "Cirugía", icon: <Healing fontSize="large" />, description: "Procedimientos quirúrgicos especializados." },
  { name: "Estética", icon: <Spa fontSize="large" />, description: "Baños, cortes y cuidado premium." },
  { name: "Otros", icon: <MoreHoriz fontSize="large" />, description: "Servicios personalizados." },
];

export default function Home() {
  return (
    <Container maxWidth="lg">
      {/* Hero Banner */}
      <Box 
        textAlign="center" 
        py={8} 
        sx={{ 
          background: "linear-gradient(135deg, rgba(103,58,183,0.2) 0%, rgba(0,0,0,0) 50%)",
          borderRadius: 4,
          my: 4,
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Cuidamos a tu mascota como se merece 🐾
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Servicios veterinarios profesionales con amor y ciencia.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ mt: 3 }}
          component={Link} 
          to="/pets"
        >
          Conoce más
        </Button>
      </Box>
        <BannerCarousel />
      {/* Sección de Servicios */}
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 8, mb: 4 }}>
        Nuestros Servicios
      </Typography>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}> {/* ¡Sintaxis actualizada! */}
            <Box 
              p={4} 
              textAlign="center"
              sx={{ 
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": { boxShadow: 3 },
                height: "100%",
              }}
            >
              <Box sx={{ color: "primary.main", mb: 2 }}>
                {service.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {service.name}
              </Typography>
              <Typography color="text.secondary">
                {service.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}