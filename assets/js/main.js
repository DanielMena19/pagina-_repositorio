// --- Función para inicializar el Carrusel ---
function initCarousel() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;

  // Si no hay diapositivas, salir de la función
  if (totalSlides == 0) return;

  // Función para mostrar una diapositiva específica
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
      dot.classList.toggle('active', i == currentSlide);
    });
  }

  // Cambiar diapositiva automáticamente cada 3 segundos
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000); // Cambia cada 3 segundos

  // Permitir que el usuario cambie de diapositiva al hacer clic en los puntos
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
    });
  });

  // Inicializar el carrusel mostrando la primera diapositiva
  showSlide(currentSlide);
}

// --- Lógica del Drawer ---
function openDrawer() {
  document.getElementById('myDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('myDrawer').classList.remove('open');
}

// --- Función para cambiar el título del encabezado ---
function updateHeaderTitle(title) {
  const headerTitle = document.querySelector('header h1');
  headerTitle.textContent = title;
}

// --- Inicializar carrusel al cargar la página inicialmente ---
window.addEventListener('DOMContentLoaded', () => {
  initCarousel();
});

// Evento para el botón del menú
document.getElementById('menu-icon').addEventListener('click', openDrawer);


