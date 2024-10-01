// --- Lógica de Login ---
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
      correo: email,
      contrasena: password
    };

    try {
      const response = await fetch('http://localhost:3000/sesiones/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (response.ok) {
        // Guardar el token, rol, idMySQL y nombreUsuario en el localStorage
        localStorage.setItem('token', result.token);  // Guardar token en localStorage
        localStorage.setItem('userRole', result.usuario.rol);  // Guardar rol del usuario
        localStorage.setItem('userName', result.usuario.nombre);  // Guardar nombre del usuario

        alert('Login exitoso');
        window.location.href = '/inicio';   // Redirigir a la página de inicio
      } else {
        // Mostrar mensaje de error específico o genérico
        document.getElementById('message').textContent = result.error || 'Error en el login. Por favor, revisa tus credenciales.';
      }
    } catch (error) {
      // Manejo de errores de red u otros
      console.error('Error en la solicitud:', error);
      document.getElementById('message').textContent = 'Error en el servidor. Inténtalo más tarde.';
    }
  });
}
