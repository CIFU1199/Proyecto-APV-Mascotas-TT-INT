// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from '../pages/Dashboard';
import Register from "../pages/Register";
import ProtectedRoute from './ProtectedRoute';
import RegisterPet from '../pages/pet/RegiterPet'
import UserManagementPage from "../pages/userManagement/userManagementPage";
import EspecieManagementPage from "../pages/species/EspecieManagementPage";
import CitasPage from "../pages/citas/CitasPage";
import GestionCitasPage from "../pages/citas/GestionCitasPage";
import HistorialMascotaPage from "../pages/citas/HistorialMascotaPage";


// Importa otras páginas aquí (ej: PetList, PetForm)

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Landing Page */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/register-pet" element={
        <ProtectedRoute>
          <RegisterPet />
        </ProtectedRoute>
      } />

      <Route path="/register-vet" element={
        <ProtectedRoute>
          <UserManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/create-species" element={
        <ProtectedRoute>
          <EspecieManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/create-appointment" element={
        <ProtectedRoute>
          <CitasPage />
        </ProtectedRoute>
      } />

      <Route path="/manage-appointments" element={
        <ProtectedRoute>
          <GestionCitasPage />
        </ProtectedRoute>
      } />
      
      <Route path="/medical-history" element={
        <ProtectedRoute>
          <HistorialMascotaPage />
        </ProtectedRoute>
      } />

    </Routes>
  );
}