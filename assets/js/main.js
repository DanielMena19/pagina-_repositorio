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

// Lógica para volver al inicio
document.getElementById('homeBtn').addEventListener('click', function() {
  document.getElementById('dynamic-content').innerHTML = `
    <section class="description">
      <p>Nuestra misión es ofrecer servicios excepcionales para ayudarte a alcanzar tus metas. Creemos en la calidad, la innovación y la dedicación en cada proyecto.</p>
    </section>

    <section class="carousel">
      <div class="carousel-container">
        <div class="carousel-slide active">
          <img src="/images/carro1.jpg" alt="Imagen 1">
        </div>
        <div class="carousel-slide">
          <img src="/images/carro2.jpg" alt="Imagen 2">
        </div>
        <div class="carousel-slide">
          <img src="/images/carro3.jpg" alt="Imagen 3">
        </div>
      </div>
      <div class="carousel-indicators">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </section>

    <section class="social-media">
      <h3>Síguenos en nuestras redes sociales:</h3>
      <div class="social-icons">
        <a href="#"><i class="fab fa-instagram"></i> Instagram</a>
        <a href="#"><i class="fab fa-facebook"></i> Facebook</a>
        <a href="#"><i class="fab fa-twitter"></i> Twitter</a>
      </div>
    </section>
  `;
  closeDrawer();
});

// Función para mostrar la pantalla de servicios
document.getElementById('servicesBtn').addEventListener('click', async function() {
  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">
      <!-- Formulario de servicios en el lado izquierdo -->
      <div class="services-form">
        <h2 id="formTitle">Agregar Servicio</h2>
        <form id="serviceForm">
          <label for="serviceName">Nombre del Servicio (obligatorio)</label>
          <input type="text" id="serviceName" placeholder="Nombre del Servicio" required>

          <label for="serviceDescription">Descripción del Servicio</label>
          <input type="text" id="serviceDescription" placeholder="Descripción del Servicio">

          <label for="serviceDuration">Duración (en minutos, obligatorio)</label>
          <input type="number" id="serviceDuration" placeholder="Duración en minutos" required>

          <label for="servicePrice">Precio (obligatorio)</label>
          <input type="number" id="servicePrice" placeholder="Precio" required>

          <button type="submit" id="submitButton">Agregar Servicio</button>
        </form>
      </div>

      <!-- Lista de servicios registrados en el lado derecho -->
      <div class="service-list">
        <h3>Servicios Registrados</h3>
        <div id="serviceListContainer"></div> <!-- Aquí se mostrarán los servicios -->
      </div>
    </div>
  `;

  let isEdit = false;
  let editServiceId = null;

  // Función para obtener todos los servicios de la API y mostrarlos
  async function obtenerServicios() {
    try {
      const response = await fetch('http://localhost:3000/servicios');
      const servicios = await response.json();
      
      // Mostrar los servicios en la interfaz
      const serviceListContainer = document.getElementById('serviceListContainer');
      serviceListContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar los servicios

      servicios.forEach(servicio => {
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('service-item');
        
        const fechaRegistro = new Date(servicio.fechaRegistroServ);
        const fechaFormateada = fechaRegistro.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        serviceItem.innerHTML = `
          <h4>${servicio.nombreServ} - $${servicio.precioServ}</h4>
          <p>Duración: ${servicio.duracionServ} minutos</p>
          <p>Descripción: ${servicio.descripcionServ || 'Sin descripción'}</p>
          <p>Fecha de Registro: ${fechaFormateada}</p>
          <div class="service-actions">
            <i class="fas fa-edit" data-id="${servicio.idServ}"></i> <!-- Icono de editar -->
            <i class="fas fa-trash" data-id="${servicio.idServ}"></i> <!-- Icono de eliminar -->
          </div>
        `;

        // Funcionalidad para eliminar servicio
        serviceItem.querySelector('.fa-trash').addEventListener('click', async function() {
          const serviceId = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            try {
              const deleteResponse = await fetch(`http://localhost:3000/servicios/${serviceId}`, {
                method: 'DELETE',
              });

              if (deleteResponse.ok) {
                obtenerServicios();  // Refrescar la lista de servicios después de eliminar
              } else {
                console.error('Error al eliminar el servicio:', await deleteResponse.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
          }
        });

        // Funcionalidad para editar servicio
        serviceItem.querySelector('.fa-edit').addEventListener('click', function() {
          const serviceId = this.getAttribute('data-id');
          const nombreServ = servicio.nombreServ;
          const descripcionServ = servicio.descripcionServ;
          const duracionServ = servicio.duracionServ;
          const precioServ = servicio.precioServ;

          // Llenar el formulario con los datos del servicio
          document.getElementById('serviceName').value = nombreServ;
          document.getElementById('serviceDescription').value = descripcionServ;
          document.getElementById('serviceDuration').value = duracionServ;
          document.getElementById('servicePrice').value = precioServ;

          // Cambiar el título del formulario, el texto del botón, y el estado de edición
          document.getElementById('formTitle').textContent = 'Editar Servicio';
          document.getElementById('submitButton').textContent = 'Actualizar Servicio';
          isEdit = true;
          editServiceId = serviceId;
        });

        serviceListContainer.appendChild(serviceItem);
      });
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  }

  // Llamar a la función para obtener los servicios al cargar la pantalla de servicios
  obtenerServicios();

  // Funcionalidad para agregar o actualizar un servicio
  document.getElementById('serviceForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nuevoServicio = {
      nombreServ: document.getElementById('serviceName').value,
      descripcionServ: document.getElementById('serviceDescription').value,
      duracionServ: document.getElementById('serviceDuration').value,
      precioServ: document.getElementById('servicePrice').value,
    };

    try {
      if (isEdit) {
        // Actualizar el servicio existente
        const response = await fetch(`http://localhost:3000/servicios/${editServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoServicio),
        });

        if (response.ok) {
          document.getElementById('formTitle').textContent = 'Agregar Servicio';  // Restablecer el título del formulario
          document.getElementById('submitButton').textContent = 'Agregar Servicio';  // Restablecer el texto del botón
          isEdit = false;  // Salir del modo de edición
          editServiceId = null;
          document.getElementById('serviceForm').reset();  // Limpiar el formulario
          obtenerServicios();  // Refrescar la lista de servicios
        } else {
          console.error('Error al actualizar el servicio:', await response.json());
        }
      } else {
        // Agregar un nuevo servicio
        const response = await fetch('http://localhost:3000/servicios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoServicio),
        });

        if (response.ok) {
          document.getElementById('serviceForm').reset();  // Limpiar el formulario
          obtenerServicios();  // Refrescar la lista de servicios
        } else {
          console.error('Error al crear el servicio:', await response.json());
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  closeDrawer();
});

// Función para cerrar sesión
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', function() {
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
    
    // Redirigir al usuario a la página de login
    window.location.href = '/login';
  });
}
