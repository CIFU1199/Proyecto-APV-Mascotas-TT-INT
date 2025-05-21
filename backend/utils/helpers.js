function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'Desconocida';
  
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad > 0 ? `${edad} años` : 'Menos de 1 año';
}

module.exports = { calcularEdad };