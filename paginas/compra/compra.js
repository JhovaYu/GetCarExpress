// Funciones para filtros, ordenamiento, paginación, etc.
// se añadirán aquí en futuras iteraciones.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de compra de autos cargada.");

    // Ejemplo: Podrías añadir aquí listeners para los botones/selects
    // const applyFiltersBtn = document.querySelector('.apply-filters-button');
    // if(applyFiltersBtn) {
    //     applyFiltersBtn.addEventListener('click', () => {
    //         alert('Funcionalidad de aplicar filtros no implementada aún.');
    //         // Aquí iría la lógica para recolectar filtros y actualizar grid
    //     });
    // }

    // const sortSelect = document.getElementById('sort-select');
    // if(sortSelect) {
    //     sortSelect.addEventListener('change', (event) => {
    //          alert(`Ordenar por: ${event.target.value} - Funcionalidad no implementada aún.`);
    //         // Aquí iría la lógica para reordenar los autos
    //     });
    // }
});

// --- Funcionalidad del Modal ---

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('carDetailModal');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const detailButtons = document.querySelectorAll('.details-button'); // Todos los botones "Ver detalles"

    // Función para abrir el modal
    const openModal = (carData) => {
        // --- Llenar el modal con datos (EJEMPLO ESTÁTICO) ---
        // En una implementación real, usarías carData para llenar esto
        document.getElementById('modalTitle').textContent = carData.title || "Título no disponible";
        document.getElementById('modalPrice').textContent = carData.price || "Precio no disponible";
        document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${carData.location || 'Tuxtla Gutiérrez, Chiapas'}`; // Asume FontAwesome
        document.getElementById('modalMainImage').src = carData.mainImage || 'https://via.placeholder.com/600x400/EEEEEE/AAAAAA?text=Imagen+Principal';
        document.getElementById('modalMainImage').alt = `Imagen principal de ${carData.title || 'auto'}`;

        // Llenar destacados (ejemplo)
        document.getElementById('modalKm').innerHTML = `<i class="fas fa-tachometer-alt"></i> ${carData.km || 'N/A'} km`;
        document.getElementById('modalTransmision').innerHTML = `<i class="fas fa-cogs"></i> ${carData.transmission || 'N/A'}`;
        // ... Llenar otros campos: color, puertas, combustible, descripción, specs, thumbnails ...

        // Limpiar thumbnails anteriores (si aplica) y añadir nuevos
        const thumbnailsContainer = document.getElementById('modalThumbnails');
        thumbnailsContainer.innerHTML = ''; // Limpiar
        if (carData.thumbnails && carData.thumbnails.length > 0) {
            carData.thumbnails.forEach((thumbUrl, index) => {
                const img = document.createElement('img');
                img.src = thumbUrl;
                img.alt = `Vista miniatura ${index + 1} de ${carData.title || 'auto'}`;
                // Añadir listener para cambiar imagen principal al hacer clic en thumbnail (opcional)
                img.addEventListener('click', () => {
                    document.getElementById('modalMainImage').src = thumbUrl; // O una versión más grande
                    // Marcar thumbnail activo (opcional)
                    thumbnailsContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                    img.classList.add('active');
                });
                thumbnailsContainer.appendChild(img);
            });
        } else {
             // Añadir placeholders si no hay thumbnails reales
             thumbnailsContainer.innerHTML = `
                <img src="https://via.placeholder.com/100x75/EEEEEE/AAAAAA?text=Thumb+1" alt="Vista miniatura 1">
                <img src="https://via.placeholder.com/100x75/EEEEEE/AAAAAA?text=Thumb+2" alt="Vista miniatura 2">
             `;
        }


        // --- Mostrar el modal ---
        modal.removeAttribute('hidden'); // Quitar el atributo hidden
        // Forzar un reflow para asegurar que la transición se aplique correctamente
        void modal.offsetWidth;
        modal.classList.add('visible');
        document.body.classList.add('modal-open'); // Bloquear scroll del body
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modal.classList.remove('visible');
        document.body.classList.remove('modal-open'); // Desbloquear scroll

        // Ocultar completamente después de la transición
        modal.addEventListener('transitionend', function handleTransitionEnd() {
            if (!modal.classList.contains('visible')) {
                modal.setAttribute('hidden', 'true');
            }
            // Remover el listener para que no se ejecute múltiples veces
            modal.removeEventListener('transitionend', handleTransitionEnd);
        }, { once: true }); // Asegura que el listener se ejecute solo una vez
    };

    // --- Event Listeners ---

    // Abrir modal al hacer clic en "Ver detalles"
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar que el enlace '#' navegue

            // --- Obtener datos del auto (EJEMPLO BÁSICO) ---
            // Idealmente, obtendrías un ID del auto y harías una petición
            // o leerías data-attributes de la tarjeta (article.car-card)
            const carCard = button.closest('.car-card'); // Encuentra la tarjeta contenedora
            const carData = {
                // Extraer datos de la tarjeta o usar datos de ejemplo
                title: carCard?.querySelector('h3')?.textContent || "Auto de Ejemplo",
                price: carCard?.querySelector('.car-price')?.firstChild.textContent.trim() || "$0",
                km: carCard?.querySelector('.car-specs li:nth-child(1)')?.textContent.replace('KM:', '').trim() || "N/A",
                transmission: carCard?.querySelector('.car-specs li:nth-child(2)')?.textContent.replace('Trans:', '').trim() || "N/A",
                mainImage: carCard?.querySelector('.car-image-container img')?.src || 'https://via.placeholder.com/600x400/EEEEEE/AAAAAA?text=Imagen+Principal',
                location: "Tuxtla Gutiérrez, Chiapas", // Ejemplo
                thumbnails: [ // URLs de ejemplo para thumbnails
                    carCard?.querySelector('.car-image-container img')?.src, // Usar la misma imagen como primer thumb
                    'https://via.placeholder.com/100x75/DDDDDD/999999?text=Vista+2',
                    'https://via.placeholder.com/100x75/CCCCCC/888888?text=Vista+3'
                ],
                // ... otros datos ...
            };

            openModal(carData);
        });
    });

    // Cerrar modal con el botón 'x'
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Cerrar modal al hacer clic fuera del contenido (en el overlay)
    if (modal) {
        modal.addEventListener('click', (event) => {
            // Si el clic fue directamente sobre el overlay (no sobre el contenido)
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Cerrar modal con la tecla 'Escape'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });

    // (Resto del código JS de compra_auto.js si existe...)
    // console.log("Página de compra de autos cargada."); // (Ya existente)
});