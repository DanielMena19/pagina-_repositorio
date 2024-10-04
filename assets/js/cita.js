document.getElementById('citaBtn').addEventListener('click', async function () {
  updateHeaderTitle('Administración de Citas'); // Cambiar el título del encabezado a "Citas"

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
  const userRole = localStorage.getItem('userRole');  // Obtener rol del usuario logueado
  const currentUserName = localStorage.getItem('userName');  // Obtener el nombre del usuario logueado

  console.log('Rol del usuario:', userRole);
  console.log('Nombre del usuario logueado:', currentUserName);

  // Inhabilitar el filtro de empleados si el rol del usuario es Staff
  if (userRole === 'Staff') {
    document.getElementById('filterEmployee').disabled = true;
  }

  // Inicializar el calendario
  function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      dateClick: function (info) {
        selectedDate = info.dateStr;

        // Resaltar el día seleccionado
        document.querySelectorAll('.fc-daygrid-day').forEach(dayEl => {
          dayEl.classList.remove('fc-daygrid-day-selected');
        });
        info.dayEl.classList.add('fc-daygrid-day-selected');

        aplicarFiltros();  // Aplicar los filtros al seleccionar una fecha
      },
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          const response = await fetch('http://localhost:3000/citas');
          citas = await response.json();

          console.log('Citas obtenidas:', citas);

          // Si es Staff, filtrar citas por el nombre del empleado logueado (insensible a mayúsculas y espacios)
          if (userRole === 'Staff') {
            citas = citas.filter(cita =>
              cita.empleadoNombre.trim().toLowerCase() === currentUserName.trim().toLowerCase()
            );
            console.log('Citas filtradas para Staff:', citas);
          }

          const calendarEvents = citas.map(cita => ({
            title: `Cita: ${cita.clienteNombre}`,
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

    // *** Filtrar siempre por empleado si es Staff ***
    if (userRole === 'Staff') {
      citasFiltradas = citas.filter(cita =>
        cita.empleadoNombre.trim().toLowerCase() === currentUserName.trim().toLowerCase()
      );
    } else if (userRole === 'Admin' && filtroEmpleado) {
      // Filtrar por empleado solo si es Admin
      citasFiltradas = citasFiltradas.filter(cita => cita.empleadoNombre === filtroEmpleado);
    }

    // Filtrar por servicio
    if (filtroServicio) {
      citasFiltradas = citasFiltradas.filter(cita => cita.servicioNombre === filtroServicio);
    }

    // Filtrar por estado
    if (filtroEstado) {
      citasFiltradas = citasFiltradas.filter(cita => cita.estadoCita === filtroEstado);
    }

    // Filtrar por fecha seleccionada
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

        // Determinar la clase de estado basada en el estado actual
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
            <i class="fas fa-ban" data-id="${cita.idCita}" title="Cancelar"></i>
            <i class="fas fa-check" data-id="${cita.idCita}" title="Confirmar"></i>
          </div>
        `;

        // Evento para cancelar la cita (cambia el estado a 'cancelada')
        citaItem.querySelector('.fa-ban').addEventListener('click', async function () {
          const citaId = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
            try {
              const response = await fetch(`http://localhost:3000/citas/${citaId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estadoCita: 'cancelada' })  // Cambiar el estado a 'cancelada'
              });

              if (response.ok) {
                await obtenerCitas();  // Refrescar la lista de citas después de cambiar el estado
              } else {
                console.error('Error al cancelar la cita:', await response.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
          }
        });

        // Evento para confirmar la cita (cambia el estado a 'confirmada')
        citaItem.querySelector('.fa-check').addEventListener('click', async function () {
          const citaId = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de que quieres confirmar esta cita?')) {
            try {
              const response = await fetch(`http://localhost:3000/citas/${citaId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estadoCita: 'confirmada' })  // Cambiar el estado a 'confirmada'
              });

              if (response.ok) {
                await obtenerCitas();  // Refrescar la lista de citas después de cambiar el estado
              } else {
                console.error('Error al confirmar la cita:', await response.json());
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            }
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
      const responseEmpleados = await fetch('http://localhost:3000/usuarios');
      const empleados = await responseEmpleados.json();

      const selectEmpleado = document.getElementById('filterEmployee');
      selectEmpleado.innerHTML = '<option value="">Todos los empleados</option>';

      // Filtrar solo empleados con rol 'Staff'
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
    aplicarFiltros(); // Restablecer los filtros, aplicando el de Staff si es necesario
  }

  // Event listeners para aplicar filtros
  document.getElementById('filterEmployee').addEventListener('change', aplicarFiltros);
  document.getElementById('filterService').addEventListener('change', aplicarFiltros);
  document.getElementById('filterState').addEventListener('change', aplicarFiltros);

  // Botón para mostrar todas las citas y restablecer los filtros
  document.getElementById('mostrarTodasCitas').addEventListener('click', function () {
    resetearFiltros();
  });

  // Inicializar el calendario y obtener datos al cargar la página
  initCalendar();
  obtenerEmpleadosYServicios();  // Obtener empleados y servicios

  // Función para obtener citas y mostrarlas
  async function obtenerCitas() {
    try {
      const response = await fetch('http://localhost:3000/citas');
      citas = await response.json();

      // Si es Staff, aplicar el filtro por defecto al cargar las citas
      if (userRole === 'Staff') {
        citas = citas.filter(cita =>
          cita.empleadoNombre.trim().toLowerCase() === currentUserName.trim().toLowerCase()
        );
      }

      aplicarFiltros();
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  }

  // Función para capitalizar las palabras
  function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  obtenerCitas();
});
