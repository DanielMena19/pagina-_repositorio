// --- Lógica para mostrar la pantalla de usuarios ---
document.getElementById('usersBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Usuarios'); // Cambiar el título del encabezado a "Usuarios"

  // Obtener rol y nombre del usuario logueado desde localStorage
  const userRole = localStorage.getItem('userRole'); 
  const userName = localStorage.getItem('userName');  // Filtrar por nombre en lugar de id

  console.log('Rol del usuario:', userRole);
  console.log('Nombre del usuario logueado:', userName);

  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">
      <!-- Formulario de usuarios en el lado izquierdo -->
      <div class="services-form">
        <h2 id="formTitle">Agregar Usuario</h2> <!-- Título por defecto -->
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

  // Si el usuario logueado es Staff, deshabilitamos la selección de roles
  if (userRole === 'Staff') {
    document.getElementById('adminRoleBtn').classList.add('disabled');
    document.getElementById('staffRoleBtn').classList.add('disabled');
  }

  // Asignar el rol seleccionado al formulario (solo si no es Staff)
  document.getElementById('adminRoleBtn').addEventListener('click', function() {
    if (userRole !== 'Staff') {  // Solo permitir cambiar el rol si no es Staff
      document.getElementById('userRole').value = 'Admin';
      document.getElementById('adminRoleBtn').classList.add('selected');
      document.getElementById('staffRoleBtn').classList.remove('selected');
    }
  });

  document.getElementById('staffRoleBtn').addEventListener('click', function() {
    if (userRole !== 'Staff') {  // Solo permitir cambiar el rol si no es Staff
      document.getElementById('userRole').value = 'Staff';
      document.getElementById('staffRoleBtn').classList.add('selected');
      document.getElementById('adminRoleBtn').classList.remove('selected');
    }
  });

  let isEdit = false;
  let editUserId = null;

  // Función para obtener usuarios desde la API
  async function obtenerUsuarios() {
    try {
      let usuarios = [];
      const response = await fetch('http://localhost:3000/usuarios');
      usuarios = await response.json();

      console.log('Usuarios obtenidos:', usuarios);

      // Si el rol es Staff, solo mostrar su propio usuario filtrando por nombre
      if (userRole === 'Staff') {
        usuarios = usuarios.filter(usuario => usuario.nombreUsuario === userName);
        console.log('Usuarios filtrados para Staff:', usuarios);
      }

      // Renderizar usuarios
      renderizarUsuarios(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }

  // Función para renderizar usuarios en el contenedor
  function renderizarUsuarios(usuarios) {
    const userListContainer = document.getElementById('userListContainer');
    userListContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar los usuarios

    if (usuarios.length === 0) {
      userListContainer.innerHTML = '<p>No se encontraron usuarios.</p>';
    } else {
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

        // Manejar eventos de eliminación y edición
        userItem.querySelector('.fa-trash').addEventListener('click', async function() {
          const userId = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
              const deleteResponse = await fetch(`http://localhost:3000/usuarios/${userId}`, {
                method: 'DELETE',
              });

              if (deleteResponse.ok) {
                alert('Usuario eliminado');
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

          if (rol === 'Admin' && userRole === 'Admin') {
            document.getElementById('adminRoleBtn').classList.add('selected');
            document.getElementById('staffRoleBtn').classList.remove('selected');
          } else if (rol === 'Staff') {
            document.getElementById('staffRoleBtn').classList.add('selected');
            document.getElementById('adminRoleBtn').classList.remove('selected');
          }

          document.getElementById('formTitle').textContent = 'Editar Usuario';
          document.getElementById('submitButton').textContent = 'Actualizar Usuario';
          document.getElementById('submitButton').disabled = false;  // Habilitar edición solo en este caso
          isEdit = true;
          editUserId = userId;

          // Eliminar el atributo required del campo contraseña al editar
          document.getElementById('userPassword').removeAttribute('required');
        });

        userListContainer.appendChild(userItem);
      });
    }
  }

  obtenerUsuarios();  // Cargar usuarios

  // Función para manejar el submit del formulario de usuario
  document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Recolectar los valores del formulario
    const nuevoUsuario = {
      nombreUsuario: document.getElementById('userName').value,
      correo: document.getElementById('userEmail').value,
      rol: document.getElementById('userRole').value,
      infoContacto: document.getElementById('userContact').value,
      puesto: document.getElementById('userPosition').value,
    };

    // Obtener el campo de la contraseña
    const passwordField = document.getElementById('userPassword');
    
    // Si estamos en modo de edición, quitar el atributo "required" del campo de contraseña
    if (isEdit) {
      passwordField.removeAttribute('required');
    } else {
      // Si estamos agregando un nuevo usuario, asegurarnos de que la contraseña sea requerida
      passwordField.setAttribute('required', true);
    }

    // Solo agregar la contraseña si el campo no está vacío
    const contrasena = passwordField.value;
    if (contrasena) {
      nuevoUsuario.contrasena = contrasena;  // Solo se incluye si hay un valor en el campo
    }

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
          alert('Usuario actualizado');
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
          alert('Usuario agregado');
          document.getElementById('userForm').reset();
          obtenerUsuarios();
        } else {
          console.error('Error al agregar el usuario:', await response.json());
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  closeDrawer();  // Si hay un drawer, cerrarlo cuando se navega a esta pantalla
});
