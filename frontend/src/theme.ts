// src/theme.ts
import { createTheme } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      drawerWidth: number;
    };
  }
  interface ThemeOptions {
    custom?: {
      drawerWidth?: number;
    };
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[500],
      light: deepPurple[300],
      dark: deepPurple[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: amber[500],
      light: amber[300],
      dark: amber[700],
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  custom: {
    drawerWidth: 240,
  },
});

export default darkTheme;