// --- Lógica del Drawer ---
function openDrawer() {
  const drawer = document.getElementById('myDrawer');
  drawer.classList.add('open');

  // Agregar una clase al body para que el contenido se mueva cuando el drawer esté abierto
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  const drawer = document.getElementById('myDrawer');
  drawer.classList.remove('open');

  // Remover la clase del body para que el contenido vuelva a su lugar
  document.body.classList.remove('drawer-open');
}

// Evento para el botón del menú
document.getElementById('menu-icon').addEventListener('click', openDrawer);

// --- Función para cerrar el drawer si se hace clic fuera de él ---
document.addEventListener('click', function (event) {
  const drawer = document.getElementById('myDrawer');
  const isClickInside = drawer.contains(event.target);
  const isMenuIcon = document.getElementById('menu-icon').contains(event.target);

  if (!isClickInside && !isMenuIcon) {
    closeDrawer();
  }
});

// --- Función para cambiar el título del encabezado ---
function updateHeaderTitle(title) {
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = title;
}

// --- Función para inicializar el Carrusel original ---
function initCarousel() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    const offset = currentSlide * -100;
    document.querySelector('.carousel-container').style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
    });
  });

  showSlide(currentSlide);
}

//-----carrusel grande
function initNewCarousel() {
  let currentNewSlide = 0;
  const newSlides = document.querySelectorAll('.new-carousel-slide');
  const newDots = document.querySelectorAll('.new-dot');
  const totalNewSlides = newSlides.length;

  if (totalNewSlides === 0) return;

  function showNewSlide(index) {
    if (index >= totalNewSlides) {
      currentNewSlide = 0;
    } else if (index < 0) {
      currentNewSlide = totalNewSlides - 1;
    } else {
      currentNewSlide = index;
    }

    // Asegúrate de que el cálculo de translateX esté correcto
    const offset = currentNewSlide * -100; // Desplazar en base al 100% del contenedor
    document.querySelector('.new-carousel-container').style.transform = `translateX(${offset}%)`;

    // Actualizar los indicadores
    newDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentNewSlide);
    });
  }

  // Auto-deslizamiento cada 3 segundos
  setInterval(() => {
    showNewSlide(currentNewSlide + 1);
  }, 3000);

  // Habilitar clic en los indicadores
  newDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showNewSlide(i);
    });
  });

  // Mostrar la primera diapositiva
  showNewSlide(currentNewSlide);
}

// --- Inicializar carruseles al cargar la página ---
window.addEventListener('DOMContentLoaded', () => {
  initNewCarousel();
  initCarousel(); // Inicializar el carrusel original
// Inicializar el nuevo carrusel
});
