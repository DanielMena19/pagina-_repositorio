// Función para mostrar la pantalla de productos
document.getElementById('productsBtn').addEventListener('click', async function () {
    updateHeaderTitle('Productos'); // Cambiar el título del encabezado a "Productos"
  
    document.getElementById('dynamic-content').innerHTML = `
      <div class="services-container">
        <!-- Carrusel de imágenes en el lado derecho -->
        <section class="new-carousel">
          <div class="new-carousel-container">
            <div class="new-carousel-slide active">
              <img src="/images/carro1.jpg" alt="Producto 1">
            </div>
            <div class="new-carousel-slide">
              <img src="/images/carro2.jpg" alt="Producto 2">
            </div>
            <div class="new-carousel-slide">
              <img src="/images/carro3.jpg" alt="Producto 3">
            </div>
          </div>
          <!-- Indicadores del carrusel -->
          <div class="new-carousel-indicators">
            <span class="new-dot active"></span>
            <span class="new-dot"></span>
            <span class="new-dot"></span>
          </div>
        </section>
  
        <!-- Lista de productos registrados en el lado izquierdo -->
        <div class="product-list">
          <h3>Productos Disponibles</h3>
          <div id="productListContainer"></div> <!-- Aquí se mostrarán los productos -->
        </div>
      </div>
    `;
  
    // Función para obtener y mostrar los productos registrados
    async function obtenerProductos() {
      try {
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();
  
        const productListContainer = document.getElementById('productListContainer');
        productListContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los productos
  
        productos.forEach(producto => {
          const productItem = document.createElement('div');
          productItem.classList.add('product-item'); // Aplicar los estilos de "product-item"
  
          productItem.innerHTML = `
            <h4>${producto.nombreProd} - $${producto.precioProd}</h4>
            <p>Disponibles: ${producto.inventarioProd} unidades</p>
            <p>Descripción: ${producto.descripcionProd || 'Sin descripción'}</p>
          `;
  
          // Agregar el producto al contenedor
          productListContainer.appendChild(productItem);
        });
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    }
  
    obtenerProductos();
    initNewCarousel(); // Inicializar el carrusel después de cargar el contenido dinámico
    closeDrawer();
  });
  