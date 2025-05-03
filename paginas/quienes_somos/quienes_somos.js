document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Verificar si los elementos existen antes de añadir listeners
    if (carousel && cards.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalCards = cards.length;

        // Función para actualizar la vista del carrusel usando scrollLeft
        function updateCarousel() {
            // Calcula el ancho de una tarjeta (debería ser el ancho del contenedor del carrusel)
            const cardWidth = carousel.offsetWidth;
            // Calcula la posición de scroll necesaria
            const scrollTo = currentIndex * cardWidth;
            // Mueve el scroll del carrusel
            carousel.scrollLeft = scrollTo;
        }

        // Evento para el botón "Anterior"
        prevBtn.addEventListener('click', () => {
            // Calcula el nuevo índice, asegurando que sea cíclico
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });

        // Evento para el botón "Siguiente"
        nextBtn.addEventListener('click', () => {
             // Calcula el nuevo índice, asegurando que sea cíclico
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });

        // Opcional: Actualizar en caso de redimensionar la ventana
        // (puede ser necesario si el ancho del carrusel cambia dinámicamente)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateCarousel(); // Reajusta la posición al nuevo tamaño
            }, 250); // Espera un poco antes de recalcular
        });

        // Inicializar la posición (aunque scrollLeft debería ser 0 por defecto)
        // updateCarousel(); // Descomentar si es necesario asegurar la posición inicial

    } else {
        console.warn('No se encontraron todos los elementos necesarios para el carrusel.');
    }
});