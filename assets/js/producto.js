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