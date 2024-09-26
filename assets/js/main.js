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

// --- Función para inicializar el Carrusel ---
function initCarousel() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;

  // Si no hay diapositivas, salir de la función
  if (totalSlides === 0) return;

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

// --- Función para cambiar el título del encabezado ---
function updateHeaderTitle(title) {
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = title;
}

// Lógica para volver al inicio
document.getElementById('homeBtn').addEventListener('click', function() {
  updateHeaderTitle('Bienvenido a App-ointment'); // Cambiar el título del encabezado a "Inicio"
  
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

  // Inicializar el carrusel al volver al inicio
  initCarousel();
  closeDrawer();
});

// --- Inicializar carrusel al cargar la página inicialmente ---
window.addEventListener('DOMContentLoaded', () => {
  initCarousel();
});

// Función para mostrar la pantalla de servicios
document.getElementById('servicesBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Servicios'); // Cambiar el título del encabezado a "Servicios"

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

  async function obtenerServicios() {
    try {
      const response = await fetch('http://localhost:3000/servicios');
      const servicios = await response.json();
      
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
            <i class="fas fa-edit" data-id="${servicio.idServ}"></i>
            <i class="fas fa-trash" data-id="${servicio.idServ}"></i>
          </div>
        `;

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

        serviceItem.querySelector('.fa-edit').addEventListener('click', function() {
          const serviceId = this.getAttribute('data-id');
          const nombreServ = servicio.nombreServ;
          const descripcionServ = servicio.descripcionServ;
          const duracionServ = servicio.duracionServ;
          const precioServ = servicio.precioServ;

          document.getElementById('serviceName').value = nombreServ;
          document.getElementById('serviceDescription').value = descripcionServ;
          document.getElementById('serviceDuration').value = duracionServ;
          document.getElementById('servicePrice').value = precioServ;

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

  obtenerServicios();

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
        const response = await fetch(`http://localhost:3000/servicios/${editServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoServicio),
        });

        if (response.ok) {
          document.getElementById('formTitle').textContent = 'Agregar Servicio';
          document.getElementById('submitButton').textContent = 'Agregar Servicio';
          isEdit = false;
          editServiceId = null;
          document.getElementById('serviceForm').reset();
          obtenerServicios();
        } else {
          console.error('Error al actualizar el servicio:', await response.json());
        }
      } else {
        const response = await fetch('http://localhost:3000/servicios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoServicio),
        });

        if (response.ok) {
          document.getElementById('serviceForm').reset();
          obtenerServicios();
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

// Función para mostrar la pantalla de productos
document.getElementById('productsBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Productos'); // Cambiar el título del encabezado a "Productos"

  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">  <!-- Usamos 'services-container' para mantener el mismo estilo -->
      <!-- Formulario de productos en el lado izquierdo -->
      <div class="services-form">  <!-- Usamos 'services-form' para mantener el mismo estilo -->
        <h2 id="formTitle">Agregar Producto</h2>
        <form id="productForm">
          <label for="productName">Nombre del Producto (obligatorio)</label>
          <input type="text" id="productName" placeholder="Nombre del Producto" required>

          <label for="productDescription">Descripción del Producto</label>
          <input type="text" id="productDescription" placeholder="Descripción del Producto">

          <label for="productPrice">Precio (obligatorio)</label>
          <input type="number" id="productPrice" placeholder="Precio" required>

          <label for="productInventory">Inventario (obligatorio)</label>
          <input type="number" id="productInventory" placeholder="Inventario" required>

          <button type="submit" id="submitButton">Agregar Producto</button>
        </form>
      </div>

      <!-- Lista de productos registrados en el lado derecho -->
      <div class="service-list">  <!-- Usamos 'service-list' para mantener el mismo estilo -->
        <h3>Productos Registrados</h3>
        <div id="productListContainer"></div> <!-- Aquí se mostrarán los productos -->
      </div>
    </div>
  `;

  let isEdit = false;
  let editProductId = null;

// Función para obtener productos desde la API
async function obtenerProductos() {
  try {
    const response = await fetch('http://localhost:3000/productos');
    const productos = await response.json();

    const productListContainer = document.getElementById('productListContainer');
    productListContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar los productos

    productos.forEach(producto => {
      const productItem = document.createElement('div');
      productItem.classList.add('service-item');  // Usamos 'service-item' para mantener el mismo estilo
      
      const fechaRegistro = new Date(producto.fechaProd);  // Asumiendo que `fechaProd` es el campo en la base de datos
      const fechaFormateada = fechaRegistro.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      productItem.innerHTML = `
        <h4>${producto.nombreProd} - $${producto.precioProd}</h4>
        <p>Inventario: ${producto.inventarioProd} unidades</p>
        <p>Descripción: ${producto.descripcionProd || 'Sin descripción'}</p>
        <p>Fecha de Registro: ${fechaFormateada}</p>
        <div class="service-actions">  <!-- Usamos 'service-actions' para mantener el mismo estilo -->
          <i class="fas fa-edit" data-id="${producto.idProd}"></i>
          <i class="fas fa-trash" data-id="${producto.idProd}"></i>
        </div>
      `;

      productItem.querySelector('.fa-trash').addEventListener('click', async function() {
        const productId = this.getAttribute('data-id');
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
          try {
            const deleteResponse = await fetch(`http://localhost:3000/productos/${productId}`, {
              method: 'DELETE',
            });

            if (deleteResponse.ok) {
              obtenerProductos();  // Refrescar la lista de productos después de eliminar
            } else {
              console.error('Error al eliminar el producto:', await deleteResponse.json());
            }
          } catch (error) {
            console.error('Error en la solicitud:', error);
          }
        }
      });

      productItem.querySelector('.fa-edit').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const nombreProd = producto.nombreProd;
        const descripcionProd = producto.descripcionProd;
        const precioProd = producto.precioProd;
        const inventarioProd = producto.inventarioProd;

        document.getElementById('productName').value = nombreProd;
        document.getElementById('productDescription').value = descripcionProd;
        document.getElementById('productPrice').value = precioProd;
        document.getElementById('productInventory').value = inventarioProd;

        document.getElementById('formTitle').textContent = 'Editar Producto';
        document.getElementById('submitButton').textContent = 'Actualizar Producto';
        isEdit = true;
        editProductId = productId;
      });

      productListContainer.appendChild(productItem);
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

  obtenerProductos();

  document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nuevoProducto = {
      nombreProd: document.getElementById('productName').value,
      descripcionProd: document.getElementById('productDescription').value,
      precioProd: document.getElementById('productPrice').value,
      inventarioProd: document.getElementById('productInventory').value,
    };

    try {
      if (isEdit) {
        const response = await fetch(`http://localhost:3000/productos/${editProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProducto),
        });

        if (response.ok) {
          document.getElementById('formTitle').textContent = 'Agregar Producto';
          document.getElementById('submitButton').textContent = 'Agregar Producto';
          isEdit = false;
          editProductId = null;
          document.getElementById('productForm').reset();
          obtenerProductos();
        } else {
          console.error('Error al actualizar el producto:', await response.json());
        }
      } else {
        const response = await fetch('http://localhost:3000/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProducto),
        });

        if (response.ok) {
          document.getElementById('productForm').reset();
          obtenerProductos();
        } else {
          console.error('Error al crear el producto:', await response.json());
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  closeDrawer();
});

// Función para actualizar el título del encabezado
function updateHeaderTitle(title) {
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = title;
}

// Función para cerrar el drawer
function closeDrawer() {
  document.getElementById('myDrawer').classList.remove('open');
}

// Función para mostrar la pantalla de usuarios
document.getElementById('usersBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Usuarios'); // Cambiar el título del encabezado a "Usuarios"

  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">
      <!-- Formulario de usuarios en el lado izquierdo -->
      <div class="services-form">
        <h2 id="formTitle">Agregar Usuario</h2>
        <form id="userForm">
          <label for="userName">Nombre del Usuario (obligatorio)</label>
          <input type="text" id="userName" placeholder="Nombre del Usuario" required>

          <label for="userEmail">Correo (obligatorio)</label>
          <input type="email" id="userEmail" placeholder="Correo" required>

          <label for="userPassword">Contraseña (obligatorio)</label>
          <input type="password" id="userPassword" placeholder="Contraseña" required>

          <label>Selecciona el Rol (obligatorio)</label>
          <div class="role-selection">
            <div class="role-option" id="adminRoleBtn">
              <img src="https://img.icons8.com/ios-glyphs/100/000000/administrative-tools.png" alt="Admin Icon" />
              <p>Admin</p>
            </div>
            <div class="role-option" id="staffRoleBtn">
              <img src="https://img.icons8.com/ios-glyphs/100/000000/conference-call.png" alt="Staff Icon" />
              <p>Staff</p>
            </div>
          </div>
          <input type="hidden" id="userRole" value="">

          <label for="userContact">Información de Contacto</label>
          <input type="text" id="userContact" placeholder="Información de Contacto">

          <label for="userPosition">Puesto</label>
          <input type="text" id="userPosition" placeholder="Puesto">

          <button type="submit" id="submitButton">Agregar Usuario</button>
        </form>
      </div>

      <!-- Lista de usuarios registrados en el lado derecho -->
      <div class="service-list">
        <h3>Usuarios Registrados</h3>
        <div id="userListContainer"></div> <!-- Aquí se mostrarán los usuarios -->
      </div>
    </div>
  `;

  let isEdit = false;
  let editUserId = null;

  // Manejadores de eventos para los botones de selección de rol
  document.getElementById('adminRoleBtn').addEventListener('click', function() {
    document.getElementById('userRole').value = 'Admin';  // Asignar el rol de Admin
    document.getElementById('adminRoleBtn').classList.add('selected');
    document.getElementById('staffRoleBtn').classList.remove('selected');
  });

  document.getElementById('staffRoleBtn').addEventListener('click', function() {
    document.getElementById('userRole').value = 'Staff';  // Asignar el rol de Staff
    document.getElementById('staffRoleBtn').classList.add('selected');
    document.getElementById('adminRoleBtn').classList.remove('selected');
  });

  // Función para obtener usuarios desde la API
  async function obtenerUsuarios() {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      const usuarios = await response.json();
      
      const userListContainer = document.getElementById('userListContainer');
      userListContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar los usuarios

      usuarios.forEach(usuario => {
        const userItem = document.createElement('div');
        userItem.classList.add('service-item');  // Usamos 'service-item' para mantener el mismo estilo

        const fechaRegistro = new Date(usuario.fechaRegistro);
        const fechaFormateada = fechaRegistro.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        userItem.innerHTML = `
          <h4>${usuario.nombreUsuario} - ${usuario.rol}</h4>
          <p>Correo: ${usuario.correo}</p>
          <p>Contacto: ${usuario.infoContacto || 'No especificado'}</p>
          <p>Puesto: ${usuario.puesto || 'No especificado'}</p>
          <p>Fecha de Registro: ${fechaFormateada}</p>
          <div class="service-actions">
            <i class="fas fa-edit" data-id="${usuario.idMySQL}"></i>
            <i class="fas fa-trash" data-id="${usuario.idMySQL}"></i>
          </div>
        `;

        userItem.querySelector('.fa-trash').addEventListener('click', async function() {
          const userId = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
              const deleteResponse = await fetch(`http://localhost:3000/usuarios/${userId}`, {
                method: 'DELETE',
              });

              if (deleteResponse.ok) {
                obtenerUsuarios();  // Refrescar la lista de usuarios después de eliminar
              } else {
                console.error('Error al eliminar el usuario:', await deleteResponse.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
          }
        });

        userItem.querySelector('.fa-edit').addEventListener('click', function() {
          const userId = this.getAttribute('data-id');
          const nombreUsuario = usuario.nombreUsuario;
          const correo = usuario.correo;
          const rol = usuario.rol;
          const infoContacto = usuario.infoContacto;
          const puesto = usuario.puesto;

          document.getElementById('userName').value = nombreUsuario;
          document.getElementById('userEmail').value = correo;
          document.getElementById('userPassword').value = '';  // Dejar vacío para que no se sobrescriba sin necesidad
          document.getElementById('userRole').value = rol;
          document.getElementById('userContact').value = infoContacto;
          document.getElementById('userPosition').value = puesto;

          if (rol == 'Admin') {
            document.getElementById('adminRoleBtn').classList.add('selected');
            document.getElementById('staffRoleBtn').classList.remove('selected');
          } else if (rol == 'Staff') {
            document.getElementById('staffRoleBtn').classList.add('selected');
            document.getElementById('adminRoleBtn').classList.remove('selected');
          }

          document.getElementById('formTitle').textContent = 'Editar Usuario';
          document.getElementById('submitButton').textContent = 'Actualizar Usuario';
          isEdit = true;
          editUserId = userId;
        });

        userListContainer.appendChild(userItem);
      });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }

  obtenerUsuarios();

  // Función para manejar el submit del formulario de usuario
  document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nuevoUsuario = {
      nombreUsuario: document.getElementById('userName').value,
      correo: document.getElementById('userEmail').value,
      contrasena: document.getElementById('userPassword').value,
      rol: document.getElementById('userRole').value,
      infoContacto: document.getElementById('userContact').value,
      puesto: document.getElementById('userPosition').value,
    };

    try {
      if (isEdit) {
        const response = await fetch(`http://localhost:3000/usuarios/${editUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (response.ok) {
          document.getElementById('formTitle').textContent = 'Agregar Usuario';
          document.getElementById('submitButton').textContent = 'Agregar Usuario';
          isEdit = false;
          editUserId = null;
          document.getElementById('userForm').reset();
          obtenerUsuarios();
        } else {
          console.error('Error al actualizar el usuario:', await response.json());
        }
      } else {
        const response = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (response.ok) {
          document.getElementById('userForm').reset();
          obtenerUsuarios();
        } else {
          console.error('Error al crear el usuario:', await response.json());
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
    localStorage.removeItem('token');
    window.location.href = '/login';
  });
};
