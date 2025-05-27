function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'Desconocida';
  
  try {
    const nacimiento = new Date(fechaNacimiento);
    // Verificar si la fecha es válida
    if (isNaN(nacimiento.getTime())) return 'Fecha inválida';
    
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad > 0 ? `${edad} años` : 'Menos de 1 año';
  } catch (error) {
    console.error('Error al calcular edad:', error);
    return 'Desconocida';
  }
}

module.exports = { calcularEdad };