// Función para mostrar la pantalla de servicios
document.getElementById('servicesBtn').addEventListener('click', async function () {
    updateHeaderTitle('Servicios'); // Cambiar el título del encabezado a "Servicios"

    document.getElementById('dynamic-content').innerHTML = `
  
    <div class="services-container">
    <!-- Carrusel de imágenes en el lado derecho -->
    <!-- Carrusel de imágenes -->
        <section class="new-carousel">
            <div class="new-carousel-container">
                <div class="new-carousel-slide active">
                <img src="/images/carro1.jpg" alt="Imagen 1">
                </div>
                <div class="new-carousel-slide">
                <img src="/images/carro2.jpg" alt="Imagen 2">
                </div>
                <div class="new-carousel-slide">
                <img src="/images/carro3.jpg" alt="Imagen 3">
                </div>
            </div>
            <!-- Indicadores del carrusel -->
            <div class="new-carousel-indicators">
                <span class="new-dot active"></span>
                <span class="new-dot"></span>
                <span class="new-dot"></span>
            </div>
        </section>
        <!-- Lista de servicios registrados en el lado izquierdo -->
        <div class="service-list">
          <h3>Servicios Disponibles</h3>
          <div id="serviceListContainer"></div> <!-- Aquí se mostrarán los servicios -->
        </div>
      </div>
    `;

    // Función para obtener y mostrar los servicios registrados
    async function obtenerServicios() {
      try {
        const response = await fetch('http://localhost:3000/servicios');
        const servicios = await response.json();

        const serviceListContainer = document.getElementById('serviceListContainer');
        serviceListContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los servicios

        servicios.forEach(servicio => {
          const serviceItem = document.createElement('div');
          serviceItem.classList.add('service-item');

          serviceItem.innerHTML = `
            <h4>${servicio.nombreServ} - $${servicio.precioServ}</h4>
            <p>Duración: ${servicio.duracionServ} minutos</p>
            <p>Descripción: ${servicio.descripcionServ || 'Sin descripción'}</p>
          `;

          // Agregar el servicio al contenedor
          serviceListContainer.appendChild(serviceItem);
        });
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    }

    obtenerServicios();
    initNewCarousel(); // Inicializar el carrusel después de cargar el contenido dinámico
    closeDrawer();
});
