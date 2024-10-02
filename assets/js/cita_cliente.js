document.getElementById('citaBtn').addEventListener('click', async function () {
  updateHeaderTitle('Agenda tu Cita'); // Cambiar el título del encabezado a "Citas"

  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">
      <!-- Formulario de agregar o editar cita -->
      <div class="services-form">
        <h2 id="formTitle">Formulario de Citas</h2>
        <form id="citaForm">
          <label for="clientName">Nombre del Cliente (obligatorio)</label>
          <input type="text" id="clientName" class="styled-input" placeholder="Nombre del Cliente" required>

          <label for="empleadoSelect">Empleado (obligatorio)</label>
          <select id="empleadoSelect" class="styled-select" required>
            <option value="">Seleccionar empleado</option>
          </select>

          <label for="servicioSelect">Servicio (obligatorio)</label>
          <select id="servicioSelect" class="styled-select" required>
            <option value="">Seleccionar servicio</option>
          </select>

          <label for="fechaCita">Fecha de la Cita (obligatorio)</label>
          <input type="date" id="fechaCita" class="styled-input" required>

          <label for="horaCita">Hora de la Cita (obligatorio)</label>
          <input type="time" id="horaCita" class="styled-input" required>

          <button type="submit" id="submitButton" class="styled-button">Agendar Cita</button>
        </form>
      </div>

      <!-- Buscador de citas por ID -->
      <div class="service-list">
        <div class="filters">
          <label for="buscarCitaId">Busca tu Cita</label>
          <input type="text" id="buscarCitaId" class="styled-input" placeholder="Numero de Cita">
          <br>
          <button id="buscarCitaBtn" class="styled-button">Buscar Cita</button>
        </div>

        <div id="appointmentsList">
          <!-- Aquí se mostrarán las citas -->
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de cita -->
    <div id="modalConfirmacionCita" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Tu cita ha sido registrada</h3>
        <p><strong>ID de la cita:</strong> <span id="citaId"></span></p>
        <p><strong>Cliente:</strong> <span id="citaCliente"></span></p>
        <p><strong>Empleado:</strong> <span id="citaEmpleado"></span></p>
        <p><strong>Servicio:</strong> <span id="citaServicio"></span></p>
        <p><strong>Fecha:</strong> <span id="citaFecha"></span></p>
        <p><strong>Hora:</strong> <span id="citaHora"></span></p>
        <p><strong>Recuerda guardar el número de tu cita, confirmarla y revisar el estado de tu cita entre 30 a 15 minutos antes.</strong></p>
      </div>
    </div>
  `;

  let isEdit = false;
  let editCitaId = null;

  // Función para cargar empleados y servicios
  async function cargarEmpleadosYServicios() {
    try {
      const responseEmpleados = await fetch('http://localhost:3000/usuarios');
      const empleados = await responseEmpleados.json();

      const selectEmpleado = document.getElementById('empleadoSelect');
      selectEmpleado.innerHTML = '<option value="">Seleccionar empleado</option>';
      const empleadosFiltrados = empleados.filter(empleado => empleado.rol === 'Staff');

      empleadosFiltrados.forEach(empleado => {
        const option = document.createElement('option');
        option.value = empleado.idMySQL;
        option.textContent = empleado.nombreUsuario;
        selectEmpleado.appendChild(option);
      });

      const responseServicios = await fetch('http://localhost:3000/servicios');
      const servicios = await responseServicios.json();

      const selectServicio = document.getElementById('servicioSelect');
      selectServicio.innerHTML = '<option value="">Seleccionar servicio</option>';
      servicios.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.idServ;
        option.textContent = servicio.nombreServ;
        selectServicio.appendChild(option);
      });
    } catch (error) {
      console.error('Error al obtener empleados o servicios:', error);
    }
  }

  cargarEmpleadosYServicios(); // Cargar las opciones de empleados y servicios al iniciar

  // Función para manejar el formulario de agregar/editar cita
  document.getElementById('citaForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nuevaCita = {
      nombrecliente: document.getElementById('clientName').value,
      idEmpleado: document.getElementById('empleadoSelect').value,
      idServicio: document.getElementById('servicioSelect').value,
      fecha: document.getElementById('fechaCita').value,
      hora: document.getElementById('horaCita').value,
    };

    try {
      if (isEdit) {
        const response = await fetch(`http://localhost:3000/citas/${editCitaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaCita),
        });

        if (response.ok) {
          document.getElementById('formTitle').textContent = 'Formulario de Citas';
          document.getElementById('submitButton').textContent = 'Agendar Cita';
          isEdit = false;
          editCitaId = null;
          document.getElementById('citaForm').reset();
          document.getElementById('buscarCitaBtn').click(); // Refrescar citas
        } else {
          console.error('Error al actualizar la cita:', await response.json());
        }
      } else {
        const response = await fetch('http://localhost:3000/citas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaCita),
        });

        if (response.ok) {
          const citaCreada = await response.json();
          
          // Mostrar los datos de la cita en el modal
          document.getElementById('citaId').textContent = citaCreada.idCita;
          document.getElementById('citaCliente').textContent = nuevaCita.nombrecliente;
          document.getElementById('citaEmpleado').textContent = document.getElementById('empleadoSelect').options[document.getElementById('empleadoSelect').selectedIndex].text;
          document.getElementById('citaServicio').textContent = document.getElementById('servicioSelect').options[document.getElementById('servicioSelect').selectedIndex].text;
          document.getElementById('citaFecha').textContent = nuevaCita.fecha;
          document.getElementById('citaHora').textContent = nuevaCita.hora;

          // Mostrar el modal
          const modal = document.getElementById('modalConfirmacionCita');
          modal.style.display = "block";

          // Cerrar el modal cuando se hace clic en la "X"
          document.querySelector('.close').addEventListener('click', function () {
            modal.style.display = "none";
          });

          document.getElementById('citaForm').reset();
          document.getElementById('buscarCitaBtn').click(); // Refrescar citas
        } else {
          console.error('Error al crear la cita:', await response.json());
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  // Función para buscar citas por ID y mostrar opciones de editar, cancelar, confirmar
  document.getElementById('buscarCitaBtn').addEventListener('click', async function () {
    const citaId = document.getElementById('buscarCitaId').value;
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';

    if (!citaId) {
      appointmentsList.innerHTML = '<p>Por favor, introduce un ID de cita válido.</p>';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/citas/${citaId}`);
      if (response.ok) {
        const cita = await response.json();

        const citaItem = document.createElement('div');
        citaItem.classList.add('service-item');

        let estadoClass = '';
        if (cita.estadoCita === 'pendiente') {
          estadoClass = 'estado-pendiente';
        } else if (cita.estadoCita === 'confirmada') {
          estadoClass = 'estado-confirmada';
        } else if (cita.estadoCita === 'cancelada') {
          estadoClass = 'estado-cancelada';
        }

        citaItem.innerHTML = `
          <h4>${capitalize(cita.clienteNombre)} - ${capitalize(cita.servicioNombre)}</h4>
          <p>Empleado: ${cita.empleadoNombre || 'Empleado no encontrado'}</p>
          <p>Fecha: ${cita.fecha}</p>
          <p>Hora: ${cita.hora}</p>
          <p class="${estadoClass}">Estado: ${capitalize(cita.estadoCita)}</p>
          <div class="service-actions">
            <i class="fas fa-edit" data-id="${cita.idCita}" title="Editar"></i>
            <i class="fas fa-ban" data-id="${cita.idCita}" title="Cancelar"></i>
            <i class="fas fa-check" data-id="${cita.idCita}" title="Confirmar"></i>
          </div>
        `;

        // Evento para editar la cita
        citaItem.querySelector('.fa-edit').addEventListener('click', function () {
          const citaId = cita.idCita;
          const clienteNombre = cita.clienteNombre;
          const idEmpleado = cita.idEmpleado;
          const idServicio = cita.idServicio;
          const fecha = cita.fecha;
          const hora = cita.hora;

          document.getElementById('clientName').value = clienteNombre;
          document.getElementById('empleadoSelect').value = idEmpleado;
          document.getElementById('servicioSelect').value = idServicio;
          document.getElementById('fechaCita').value = fecha;
          document.getElementById('horaCita').value = hora;

          document.getElementById('formTitle').textContent = 'Editar Datos de tu Cita';
          document.getElementById('submitButton').textContent = 'Editar';
          isEdit = true;
          editCitaId = citaId;
        });

        // Evento para cancelar la cita
        citaItem.querySelector('.fa-ban').addEventListener('click', async function () {
          if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
            try {
              const response = await fetch(`http://localhost:3000/citas/${citaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoCita: 'cancelada' }),
              });

              if (response.ok) {
                document.getElementById('buscarCitaBtn').click(); // Refrescar lista de citas
              } else {
                console.error('Error al cancelar la cita:', await response.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
          }
        });

        // Evento para confirmar la cita
        citaItem.querySelector('.fa-check').addEventListener('click', async function () {
          if (confirm('¿Estás seguro de que quieres confirmar esta cita?')) {
            try {
              const response = await fetch(`http://localhost:3000/citas/${citaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoCita: 'confirmada' }),
              });

              if (response.ok) {
                document.getElementById('buscarCitaBtn').click(); // Refrescar lista de citas
              } else {
                console.error('Error al confirmar la cita:', await response.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
          }
        });

        appointmentsList.appendChild(citaItem);
      } else {
        appointmentsList.innerHTML = '<p>No se encontró ninguna cita con ese ID.</p>';
      }
    } catch (error) {
      console.error('Error en la búsqueda de la cita:', error);
      appointmentsList.innerHTML = '<p>Error en la búsqueda de la cita. Inténtalo más tarde.</p>';
    }
  });

  closeDrawer();

  function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }
});
