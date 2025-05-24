// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from '../pages/Dashboard';
import Register from "../pages/Register";
import { ProtectedRoute } from '../components/ProtectedRoute';
import RegisterPet from '../pages/pet/RegiterPet'
import UserManagementPage from "../pages/userManagement/userManagementPage";

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


    </Routes>
  );
}