// Función para mostrar la pantalla de citas
document.getElementById('appointmentsBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Citas'); // Cambiar el título del encabezado a "Citas"

  // Agregar el contenido dinámico para la pantalla de citas
  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container"> <!-- Reutilizamos 'services-container' para mantener el estilo -->
      <!-- Calendario en el lado izquierdo -->
      <div class="calendar-container">
        <div id="calendar"></div>
      </div>

      <!-- Lista de citas del día en el lado derecho -->
      <div class="service-list"> <!-- Reutilizamos 'service-list' para mantener el estilo -->
        <div class="filters">
          <label for="filterEmployee">Filtrar por empleado</label>
          <select id="filterEmployee">
            <option value="">Todos los empleados</option>
            <!-- Opciones generadas dinámicamente -->
          </select>

          <label for="filterService">Filtrar por servicio</label>
          <select id="filterService">
            <option value="">Todos los servicios</option>
            <!-- Opciones generadas dinámicamente -->
          </select>

          <label for="filterState">Filtrar por estado</label>
          <select id="filterState">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div id="appointmentsList">
          <!-- Aquí se mostrarán las citas del día seleccionado -->
        </div>
      </div>
    </div>
  `;

  let selectedDate = null;
  let citas = [];

  // Inicializar el calendario
  function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      dateClick: function(info) {
        selectedDate = info.dateStr;
        mostrarCitasDelDia(selectedDate);
      },
      events: async function(fetchInfo, successCallback, failureCallback) {
        try {
          const response = await fetch('http://localhost:3000/citas'); // Asegúrate de que la ruta sea correcta
          citas = await response.json();
          const calendarEvents = citas.map(cita => ({
            title: `Cita con ${cita.clienteNombre}`,
            start: cita.fecha,
            allDay: true
          }));
          successCallback(calendarEvents);
        } catch (error) {
          console.error('Error al cargar eventos del calendario:', error);
          failureCallback(error);
        }
      }
    });
    calendar.render();
  }

  // Función para mostrar las citas del día seleccionado
  async function mostrarCitasDelDia(date) {
    const citasDelDia = citas.filter(cita => cita.fecha.split('T')[0] == date); // Comparamos solo la parte de la fecha
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';

    if (citasDelDia.length == 0) {
      appointmentsList.innerHTML = '<p>No hay citas para este día.</p>';
    } else {
      citasDelDia.forEach(cita => {
        const citaItem = document.createElement('div');
        citaItem.classList.add('service-item');  // Reutilizamos 'service-item' para mantener el estilo

        citaItem.innerHTML = `
          <h4>${cita.clienteNombre} - ${cita.servicioNombre}</h4>
          <p>Empleado: ${cita.empleadoNombre}</p>
          <p>Hora: ${cita.hora}</p>
          <p>Estado: 
            <select class="estado-cita" data-id="${cita.idCita}">
              <option value="pendiente" ${cita.estadoCita === 'pendiente' ? 'selected' : ''}>Pendiente</option>
              <option value="confirmada" ${cita.estadoCita === 'confirmada' ? 'selected' : ''}>Confirmada</option>
              <option value="cancelada" ${cita.estadoCita === 'cancelada' ? 'selected' : ''}>Cancelada</option>
            </select>
          </p>
        `;

        // Event listener para cambiar el estado de la cita
        citaItem.querySelector('.estado-cita').addEventListener('change', async function() {
          const idCita = this.getAttribute('data-id');
          const nuevoEstado = this.value;

          try {
            const response = await fetch(`http://localhost:3000/citas/${idCita}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ estadoCita: nuevoEstado })
            });
            if (response.ok) {
              alert('Estado de la cita actualizado');
            } else {
              console.error('Error al actualizar el estado de la cita:', await response.json());
            }
          } catch (error) {
            console.error('Error en la solicitud:', error);
          }
        });

        appointmentsList.appendChild(citaItem);
      });
    }
  }

  // Función para obtener empleados y servicios desde la API
  async function obtenerEmpleadosYServicios() {
    try {
      // Obtener empleados
      const responseEmpleados = await fetch('http://localhost:3000/empleados');
      const empleados = await responseEmpleados.json();

      const selectEmpleado = document.getElementById('filterEmployee');
      selectEmpleado.innerHTML = '<option value="">Todos los empleados</option>';
      empleados.forEach(empleado => {
        const option = document.createElement('option');
        option.value = empleado.idMySQL; // Asegúrate de usar el campo id adecuado
        option.textContent = empleado.nombreUsuario;
        selectEmpleado.appendChild(option);
      });

      // Obtener servicios
      const responseServicios = await fetch('http://localhost:3000/servicios');
      const servicios = await responseServicios.json();

      const selectServicio = document.getElementById('filterService');
      selectServicio.innerHTML = '<option value="">Todos los servicios</option>';
      servicios.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.idServ; // Asegúrate de usar el campo id adecuado
        option.textContent = servicio.nombreServ;
        selectServicio.appendChild(option);
      });

    } catch (error) {
      console.error('Error al obtener empleados o servicios:', error);
    }
  }

  // Inicializar el calendario y obtener datos al cargar la página
  initCalendar();
  obtenerEmpleadosYServicios();

  closeDrawer();  // Cerrar el drawer después de cargar la página de citas
});
