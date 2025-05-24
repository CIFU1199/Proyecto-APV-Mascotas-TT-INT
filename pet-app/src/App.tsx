import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <AppRouter />
      <Footer />
    </Router>
  );
}

export default App;