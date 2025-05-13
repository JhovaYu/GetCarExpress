window.addEventListener('scroll', function() {
  const title = document.getElementById('title');
  const header = document.getElementById('header');
  const content = document.getElementById('content');
  
  // Control de visibilidad y animaciones
  if (window.scrollY > 50) {
    // Mover el título hacia arriba y hacerlo invisible
    title.style.top = '20px';
    title.style.left = '50%';
    title.style.transform = 'translateX(-50%)';
    title.style.fontSize = '5rem'; // Reducir tamaño del título
    title.style.opacity = '0'; // Desaparecer el título

    // Mostrar el header (moverlo hacia abajo desde la parte superior)
    header.style.display = 'block'; // Aseguramos que el header se muestre
    header.style.opacity = '1'; // Hacerlo visible
    header.style.transform = 'translateY(0)'; // Deslizar desde arriba
    header2.style.transform = 'translateY(108%)';

    // Animar el contenido
    content.classList.add('show');
  } else {
    header2.style.opacity = '1'; // Hacerlo visible
    header2.style.transform = 'translateY(0)';
    // Restaurar el título a su estado original
    title.style.position = 'absolute';
    title.style.top = '50%';
    title.style.transform = 'translate(-50%, -50%)';
    title.style.fontSize = '13rem';
    title.style.opacity = '1'; // Volver a mostrar el título

    // Ocultar el header (deslizar hacia arriba)
    header.style.opacity = '0'; // Hacerlo invisible
    header.style.transform = 'translateY(-100%)'; // Deslizar fuera de la vista
    
    // Ocultar el contenido
    content.classList.remove('show');
  }
});
