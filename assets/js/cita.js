// Función para mostrar la pantalla de citas
document.getElementById('appointmentsBtn').addEventListener('click', async function() {
  updateHeaderTitle('Administración de Citas'); // Cambiar el título del encabezado a "Citas"

  // Agregar el contenido dinámico para la pantalla de citas
  document.getElementById('dynamic-content').innerHTML = `
    <div class="services-container">
      <div class="calendar-container">
        <div id="calendar"></div>
      </div>

      <div class="service-list">
        <div class="filters">
          <label for="filterEmployee">Filtrar por empleado</label>
          <select id="filterEmployee">
            <option value="">Todos los empleados</option>
          </select>

          <label for="filterService">Filtrar por servicio</label>
          <select id="filterService">
            <option value="">Todos los servicios</option>
          </select>

          <label for="filterState">Filtrar por estado</label>
          <select id="filterState">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <button id="mostrarTodasCitas">Mostrar todas las citas</button>
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

        // Quitar el resaltado de los días anteriores seleccionados
        document.querySelectorAll('.fc-daygrid-day').forEach(dayEl => {
          dayEl.classList.remove('fc-daygrid-day-selected');
        });

        // Resaltar el día seleccionado
        info.dayEl.classList.add('fc-daygrid-day-selected');

        aplicarFiltros();
      },
      events: async function(fetchInfo, successCallback, failureCallback) {
        try {
          const response = await fetch('http://localhost:3000/citas');
          citas = await response.json();
          const calendarEvents = citas.map(cita => ({
            title: `Cita`,
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

  // Función para aplicar los filtros
  function aplicarFiltros() {
    const filtroEmpleado = document.getElementById('filterEmployee').value;
    const filtroServicio = document.getElementById('filterService').value;
    const filtroEstado = document.getElementById('filterState').value;

    let citasFiltradas = citas;

    if (filtroEmpleado) {
      citasFiltradas = citasFiltradas.filter(cita => cita.empleadoNombre === filtroEmpleado);
    }

    if (filtroServicio) {
      citasFiltradas = citasFiltradas.filter(cita => cita.servicioNombre === filtroServicio);
    }

    if (filtroEstado) {
      citasFiltradas = citasFiltradas.filter(cita => cita.estadoCita === filtroEstado);
    }

    if (selectedDate) {
      citasFiltradas = citasFiltradas.filter(cita => cita.fecha === selectedDate);
    }

    mostrarCitasFiltradas(citasFiltradas);
  }

  // Función para mostrar las citas filtradas
  function mostrarCitasFiltradas(citasFiltradas) {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';

    if (citasFiltradas.length === 0) {
      appointmentsList.innerHTML = '<p>No hay citas para los filtros seleccionados.</p>';
    } else {
      citasFiltradas.forEach(cita => {
        const citaItem = document.createElement('div');
        citaItem.classList.add('service-item');

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
              // Actualizar el estado de la cita en la lista de citas sin recargar
              const citaIndex = citas.findIndex(c => c.idCita == idCita);
              if (citaIndex !== -1) {
                citas[citaIndex].estadoCita = nuevoEstado;
                aplicarFiltros(); // Vuelve a aplicar los filtros para reflejar el cambio
              }
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
      // Obtener empleados con el rol Staff
      const responseEmpleados = await fetch('http://localhost:3000/usuarios');
      const empleados = await responseEmpleados.json();

      const selectEmpleado = document.getElementById('filterEmployee');
      selectEmpleado.innerHTML = '<option value="">Todos los empleados</option>';

      const empleadosStaff = empleados.filter(empleado => empleado.rol === 'Staff');

      empleadosStaff.forEach(empleado => {
        const option = document.createElement('option');
        option.value = empleado.nombreUsuario;
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
        option.value = servicio.nombreServ;
        option.textContent = servicio.nombreServ;
        selectServicio.appendChild(option);
      });

    } catch (error) {
      console.error('Error al obtener empleados o servicios:', error);
    }
  }

  // Función para restablecer los filtros
  function resetearFiltros() {
    document.getElementById('filterEmployee').value = '';
    document.getElementById('filterService').value = '';
    document.getElementById('filterState').value = '';
    selectedDate = null;
    mostrarCitasFiltradas(citas); // Mostrar todas las citas
  }

  // Event listeners para aplicar filtros
  document.getElementById('filterEmployee').addEventListener('change', aplicarFiltros);
  document.getElementById('filterService').addEventListener('change', aplicarFiltros);
  document.getElementById('filterState').addEventListener('change', aplicarFiltros);

  // Botón para mostrar todas las citas y restablecer los filtros
  document.getElementById('mostrarTodasCitas').addEventListener('click', function() {
    resetearFiltros();
  });

  // Inicializar el calendario y obtener datos al cargar la página
  initCalendar();
  obtenerEmpleadosYServicios();

  closeDrawer();  // Cerrar el drawer después de cargar la página de citas
});
