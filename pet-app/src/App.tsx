import { BrowserRouter as Router } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <Navbar />
        <AppRouter />
        <Footer />
      </Router>
    </LocalizationProvider>
  );
}

export default App;