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
        localStorage.setItem('token', result.token);  // Guardar token en localStorage
        alert('Login exitoso');
        window.location.href = '/inicio';   // Redirigir a la página de inicio
      } else {
        document.getElementById('message').textContent = result.error || 'Error en el login';
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      document.getElementById('message').textContent = 'Error en el servidor';
    }
  });
}