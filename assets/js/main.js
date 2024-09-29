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
document.addEventListener('click', function(event) {
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

// --- Función para inicializar el Carrusel ---
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

// --- Inicializar carrusel al cargar la página ---
window.addEventListener('DOMContentLoaded', () => {
  initCarousel();
});
