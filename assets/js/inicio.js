// Lógica para volver al inicio
document.getElementById('homeBtn').addEventListener('click', function() {
  updateHeaderTitle('Bienvenido a App-ointment'); // Cambiar el título del encabezado a "Inicio"
  
  document.getElementById('dynamic-content').innerHTML = `
    <section class="description">
      <p>Nuestra misión es ofrecer servicios excepcionales para ayudarte a alcanzar tus metas. Creemos en la calidad, la innovación y la dedicación en cada proyecto.</p>
    </section>

    <section class="carousel">
      <div class="carousel-container">
        <div class="carousel-slide active">
          <img src="/images/carro1.jpg" alt="Imagen 1">
        </div>
        <div class="carousel-slide">
          <img src="/images/carro2.jpg" alt="Imagen 2">
        </div>
        <div class="carousel-slide">
          <img src="/images/carro3.jpg" alt="Imagen 3">
        </div>
      </div>
      <div class="carousel-indicators">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </section>

    <section class="social-media">
      <h3>Síguenos en nuestras redes sociales:</h3>
      <div class="social-icons">
        <a href="#"><i class="fab fa-instagram"></i> Instagram</a>
        <a href="#"><i class="fab fa-facebook"></i> Facebook</a>
        <a href="#"><i class="fab fa-twitter"></i> Twitter</a>
      </div>
    </section>
  `;

  // Inicializar el carrusel al volver al inicio
  initCarousel();
  closeDrawer();
});
