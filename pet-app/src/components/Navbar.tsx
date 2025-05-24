import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Pets,
  PersonAdd,
  Pets as SpeciesIcon,
  AddCircle,
  CalendarToday,
  MedicalServices,
  ExitToApp,
  AdminPanelSettings,
  MedicalInformation,
  Person,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userRole = userData?.rol || 0; // 1: Admin, 2: Veterinario, 3: Cliente

  useEffect(() => {
    console.log("Datos de usuario:", {
      userData,
      userRole: userData?.rol,
      localStorage: localStorage.getItem("userData"),
    });
  }, []);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
    handleClose();
  };

  // Opciones del menú basadas en el rol
  const getMenuOptions = () => {
    const commonOptions = [
      {
        show: true,
        icon: <ExitToApp sx={{ mr: 1 }} />,
        text: "Cerrar Sesión",
        action: handleLogout,
        color: "error.main",
      },
    ];

    const adminOptions = [
      {
        show: userRole === 1,
        icon: <PersonAdd sx={{ mr: 1 }} />,
        text: "Registrar Veterinario",
        action: () => {
          navigate("/register-vet");
          handleClose();
        },
      },
      {
        show: userRole === 1,
        icon: <SpeciesIcon sx={{ mr: 1 }} />,
        text: "Crear Especie",
        action: () => {
          navigate("/create-species");
          handleClose();
        },
      },
      {
        show: userRole === 1,
        icon: <Pets sx={{ mr: 1 }} />,
        text: "Registrar Mascota",
        action: () => {
          navigate("/register-pet");
          handleClose();
        },
      },
      {
        show: userRole === 1,
        icon: <AddCircle sx={{ mr: 1 }} />,
        text: "Crear Cita",
        action: () => {
          navigate("/create-appointment");
          handleClose();
        },
      },
      {
        show: userRole === 1,
        icon: <CalendarToday sx={{ mr: 1 }} />,
        text: "Gestionar Citas",
        action: () => {
          navigate("/manage-appointments");
          handleClose();
        },
      },
      {
        show: userRole === 1,
        icon: <MedicalServices sx={{ mr: 1 }} />,
        text: "Historial Médico",
        action: () => {
          navigate("/medical-history");
          handleClose();
        },
      },
    ];

    const vetOptions = [
      {
        show: userRole === 2,
        icon: <SpeciesIcon sx={{ mr: 1 }} />,
        text: "Crear Especie",
        action: () => {
          navigate("/create-species");
          handleClose();
        },
      },
      {
        show: userRole === 2,
        icon: <CalendarToday sx={{ mr: 1 }} />,
        text: "Gestionar Citas",
        action: () => {
          navigate("/manage-appointments");
          handleClose();
        },
      },
      {
        show: userRole === 2,
        icon: <MedicalServices sx={{ mr: 1 }} />,
        text: "Historial Médico",
        action: () => {
          navigate("/medical-history");
          handleClose();
        },
      },
    ];

    const clientOptions = [
      {
        show: userRole === 3,
        icon: <Pets sx={{ mr: 1 }} />,
        text: "Registrar Mascota",
        action: () => {
          navigate("/register-pet");
          handleClose();
        },
      },
      {
        show: userRole === 3,
        icon: <AddCircle sx={{ mr: 1 }} />,
        text: "Crear Cita",
        action: () => {
          navigate("/create-appointment");
          handleClose();
        },
      },
    ];

    return [
      ...adminOptions,
      ...vetOptions,
      ...clientOptions,
      ...commonOptions,
    ].filter((option) => option.show);
  };

  // Icono de perfil según rol
  const getProfileIcon = () => {
    switch (userRole) {
      case 1:
        return <AdminPanelSettings sx={{ mr: 1 }} />;
      case 2:
        return <MedicalInformation sx={{ mr: 1 }} />;
      case 3:
        return <Person sx={{ mr: 1 }} />;
      default:
        return <Person sx={{ mr: 1 }} />;
    }
  };

  // Texto del rol
  const getRoleText = () => {
    switch (userRole) {
      case 1:
        return "Administrador";
      case 2:
        return "Veterinario";
      case 3:
        return "Cliente";
      default:
        return "Usuario";
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "background.paper" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={Link}
          to={isAuthenticated ? "/dashboard" : "/"}
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => {
            if (anchorEl) {
              handleClose();
            }
          }}
        >
          <Pets color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PetCare
          </Typography>
        </Box>

        {/* Menú según autenticación */}
        {isAuthenticated ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ textAlign: "right", mr: 2 }}>
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {userData.nombre || "Usuario"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {getRoleText()}
              </Typography>
            </Box>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ color: "text.primary" }}
            >
              {getProfileIcon()}
              <MenuIcon sx={{ ml: 1 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: 1 }}
            >
              {getMenuOptions().map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={option.action}
                  sx={{ color: option.color || "inherit" }}
                >
                  {option.icon}
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                borderRadius: 20,
                px: 3,
                mr: 2,
                textTransform: "none",
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              sx={{
                borderRadius: 20,
                px: 3,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
