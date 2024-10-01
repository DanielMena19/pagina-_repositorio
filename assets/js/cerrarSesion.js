// Función para cerrar sesión
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/';
  });
};