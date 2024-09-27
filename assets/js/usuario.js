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