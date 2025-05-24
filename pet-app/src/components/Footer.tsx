import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, Pets, LocalPhone, Email, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.secondary',
        py: 6,
        mt: '2rem' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo y descripción */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Pets color="primary" sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6" color="text.primary">
                PetCare Clinic
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Cuidando a tus mascotas con amor y profesionalismo desde 2010.
            </Typography>
            <Box>
              <IconButton aria-label="Facebook" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton aria-label="Instagram" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton aria-label="Twitter" color="inherit">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Servicios
            </Typography>
            <Link href="#" color="inherit" display="block" mb={1}>Consulta</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Vacunación</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Emergencias</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Cirugía</Link>
          </Grid>

          {/* Contacto */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocalPhone fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">+1 234 567 890</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">info@petcare.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Av. Principal 123, Ciudad</Typography>
            </Box>
          </Grid>

          {/* Horario */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Horario
            </Typography>
            <Typography variant="body2" gutterBottom>
              Lunes a Viernes: 9:00 - 18:00
            </Typography>
            <Typography variant="body2" gutterBottom>
              Sábados: 9:00 - 14:00
            </Typography>
            <Typography variant="body2">
              Emergencias: 24/7
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} PetCare Clinic. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
