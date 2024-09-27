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
