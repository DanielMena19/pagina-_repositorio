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

// --- Lógica del Carrusel ---
if (document.querySelectorAll('.carousel-slide').length > 0) {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;

  // Función para mostrar una diapositiva específica
  function showSlide(index) {
    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    const offset = currentSlide * -100;
    document.querySelector('.carousel-container').style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Cambiar diapositiva automáticamente cada 3 segundos
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000); // Cambia cada 3 segundos

  // Permitir que el usuario cambie de diapositiva al hacer clic en los puntos
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
    });
  });

  // Inicializar el carrusel mostrando la primera diapositiva
  showSlide(currentSlide);
}

// --- Lógica del Drawer ---
function openDrawer() {
  document.getElementById('myDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('myDrawer').classList.remove('open');
}

// Función para cerrar sesión
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
    
    // Redirigir al usuario a la página de login
    window.location.href = '/login';
  });
}
