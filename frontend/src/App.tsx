import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Mascotas from "./pages/Mascotas";
import AgendarCita from "./pages/AgendarCita";
import GestionCitas from "./pages/GestionCitas";
import HistorialMascota from "./pages/HistorialMascota";
import Navbar from './components/Navbar';
import { User } from "./types/index";


function App() {
  const [user, setUser] = useState<User | null>(null);

  // Recuperar usuario al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
          
          {/* Rutas para dueños */}
          <Route path="/mascotas" element={
            user?.tipo === 'dueño' ? 
              <Mascotas user={user} /> : 
              <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/citas" element={
            user?.tipo === 'dueño' ? 
              <AgendarCita user={user} /> : 
              <Navigate to="/dashboard" replace />
          } />
          
          {/* Rutas para veterinarios */}
          <Route path="/gestion-citas" element={
            user?.tipo === 'veterinario' ? 
              <GestionCitas user={user} /> : 
              <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/historial" element={
            user?.tipo === 'veterinario' ? 
              <HistorialMascota user={user} /> : 
              <Navigate to="/dashboard" replace />
          } />
        </Route>

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;