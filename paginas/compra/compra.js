document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de compra de autos cargada (Filtros, Ordenamiento y Paginación).");

    // --- Selectores del DOM ---
    const priceMinInput = document.querySelector('.filters-sidebar .price-range-placeholder input[aria-label="Precio mínimo"]');
    const priceMaxInput = document.querySelector('.filters-sidebar .price-range-placeholder input[aria-label="Precio máximo"]');
    const brandCheckboxes = document.querySelectorAll('.filters-sidebar .filter-options input[name="marca"]');
    const yearMinInput = document.querySelector('.filters-sidebar .year-range-placeholder input[aria-label="Año desde"]');
    const yearMaxInput = document.querySelector('.filters-sidebar .year-range-placeholder input[aria-label="Año hasta"]');
    const mileageSelect = document.querySelector('.filters-sidebar .mileage-range-placeholder select');
    const typeCheckboxes = document.querySelectorAll('.filters-sidebar .filter-options input[name="tipo"]');

    const applyFiltersBtn = document.querySelector('.apply-filters-button');
    const clearFiltersBtn = document.querySelector('.clear-filters-button');
    const carGrid = document.querySelector('.car-grid');
    const resultsCountElement = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    const paginationContainer = document.querySelector('.pagination');

    const itemsPerPage = 10; // Considera hacerlo configurable si es necesario
    let currentPage = 1;
    let allCarCardElements = [];
    let filteredAndSortedCarElements = [];

    function getCarData(carCard) {
        const data = {};
        data.price = parseInt(carCard.dataset.price, 10);
        data.brand = carCard.dataset.brand?.toLowerCase();
        data.year = parseInt(carCard.dataset.year, 10);
        data.km = parseInt(carCard.dataset.km, 10);
        data.type = carCard.dataset.type?.toLowerCase();
        return data;
    }

    if (carGrid) {
        allCarCardElements = Array.from(carGrid.querySelectorAll('.car-card'));
        filteredAndSortedCarElements = [...allCarCardElements];
        updateCarDisplay();
    } else {
        console.error("El contenedor .car-grid no fue encontrado.");
        if(resultsCountElement) resultsCountElement.textContent = "0";
        return;
    }

    function updateCarDisplay() {
        applyFiltersAndSort();
        currentPage = 1;
        renderPaginationControls();
        displayCurrentPageItems();
        updateResultsCount();
    }

    function applyFiltersAndSort() {
        const priceMin = parseInt(priceMinInput.value, 10) || 0;
        const priceMax = parseInt(priceMaxInput.value, 10) || Infinity;
        const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.value.toLowerCase());
        const yearMin = parseInt(yearMinInput.value, 10) || 0;
        const yearMax = parseInt(yearMaxInput.value, 10) || Infinity;
        const maxMileageVal = mileageSelect.value;
        const maxMileage = maxMileageVal ? parseInt(maxMileageVal, 10) : Infinity;
        const selectedTypes = Array.from(typeCheckboxes).filter(cb => cb.checked).map(cb => cb.value.toLowerCase());

        filteredAndSortedCarElements = allCarCardElements.filter(cardElement => {
            const carData = getCarData(cardElement);
            let passesFilter = true;
            if (!isNaN(carData.price) && (carData.price < priceMin || carData.price > priceMax)) passesFilter = false;
            if (selectedBrands.length > 0 && (!carData.brand || !selectedBrands.includes(carData.brand))) passesFilter = false;
            if (!isNaN(carData.year) && (carData.year < yearMin || carData.year > yearMax)) passesFilter = false;
            if (!isNaN(carData.km) && carData.km > maxMileage) passesFilter = false;
            if (selectedTypes.length > 0 && (!carData.type || !selectedTypes.includes(carData.type))) passesFilter = false;
            return passesFilter;
        });

        const sortBy = sortSelect.value;
        if (sortBy !== 'relevant') {
            filteredAndSortedCarElements.sort((a, b) => {
                const dataA = getCarData(a);
                const dataB = getCarData(b);

                // Para depurar, puedes descomentar esto en tu navegador:
                // console.log(`Ordenando: A=${JSON.stringify(dataA)}, B=${JSON.stringify(dataB)}, Criterio=${sortBy}`);

                let valA, valB;

                switch (sortBy) {
                    case 'price-asc':
                        valA = dataA.price;
                        valB = dataB.price;
                        // Tratar NaN como el valor más grande para que vaya al final en orden ascendente
                        if (isNaN(valA)) valA = Infinity;
                        if (isNaN(valB)) valB = Infinity;
                        return valA - valB;
                    case 'price-desc':
                        valA = dataA.price;
                        valB = dataB.price;
                        // Tratar NaN como el valor más pequeño para que vaya al principio en orden descendente
                        if (isNaN(valA)) valA = -Infinity;
                        if (isNaN(valB)) valB = -Infinity;
                        return valB - valA;
                    case 'year-desc': // Más nuevos primero (año mayor)
                        valA = dataA.year;
                        valB = dataB.year;
                        if (isNaN(valA)) valA = -Infinity; // Años NaN al final
                        if (isNaN(valB)) valB = -Infinity;
                        return valB - valA;
                    case 'km-asc': // Menor kilometraje primero
                        valA = dataA.km;
                        valB = dataB.km;
                        if (isNaN(valA)) valA = Infinity; // KM NaN al final
                        if (isNaN(valB)) valB = Infinity;
                        return valA - valB;
                    default:
                        return 0;
                }
            });
        }
    }

    // En tu archivo compra.js
    function displayCurrentPageItems() {
        if (!carGrid) {
            console.error("Elemento carGrid no encontrado en displayCurrentPageItems.");
            return;
        }
        carGrid.innerHTML = ''; // ¡Importante! Limpiar la cuadrícula antes de añadir elementos ordenados.

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredAndSortedCarElements.slice(startIndex, endIndex);

        if (pageItems.length === 0 && filteredAndSortedCarElements.length > 0 && currentPage > 1) {
            // Si la página actual queda vacía después de filtrar pero aún hay resultados en general,
            // intenta volver a la primera página o a la última página válida.
            currentPage = Math.min(currentPage, Math.ceil(filteredAndSortedCarElements.length / itemsPerPage)) || 1;

            // Volvemos a calcular los items para la (posiblemente) nueva página actual
            const newStartIndex = (currentPage - 1) * itemsPerPage;
            const newEndIndex = newStartIndex + itemsPerPage;
            const newPageItems = filteredAndSortedCarElements.slice(newStartIndex, newEndIndex);

            newPageItems.forEach(cardElement => {
                carGrid.appendChild(cardElement);
            });
            // Es crucial re-renderizar los controles de paginación si currentPage cambió.
            renderPaginationControls();

        } else if (pageItems.length === 0 && filteredAndSortedCarElements.length === 0) {
            // No hay autos que mostrar en absoluto.
            // Opcional: Mostrar un mensaje en la cuadrícula.
            // carGrid.innerHTML = '<p style="text-align: center; width: 100%;">No se encontraron autos con los filtros aplicados.</p>';
        } else {
            pageItems.forEach(cardElement => {
                carGrid.appendChild(cardElement); // Añadir en el nuevo orden.
            });
        }
    }

    function updateResultsCount() {
        if (resultsCountElement) {
            resultsCountElement.textContent = filteredAndSortedCarElements.length;
        }
    }

    function renderPaginationControls() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        const totalItems = filteredAndSortedCarElements.length;
        if (totalItems === 0) {
             if (resultsCountElement) resultsCountElement.textContent = "0";
            return;
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) {
            return;
        }

        paginationContainer.appendChild(
            createPageLink('Anterior', currentPage > 1 ? currentPage - 1 : null, currentPage === 1, 'prev')
        );

        const MAX_VISIBLE_BUTTONS = 5;
        let startPage, endPage;

        if (totalPages <= MAX_VISIBLE_BUTTONS) {
            startPage = 1;
            endPage = totalPages;
        } else {
            let maxPagesBeforeCurrent = Math.floor((MAX_VISIBLE_BUTTONS - 2) / 2);
            let maxPagesAfterCurrent = Math.ceil((MAX_VISIBLE_BUTTONS - 2) / 2) -1;
            if (MAX_VISIBLE_BUTTONS < 5) maxPagesAfterCurrent = maxPagesBeforeCurrent;

            if (currentPage <= maxPagesBeforeCurrent +1 ) {
                startPage = 1;
                endPage = MAX_VISIBLE_BUTTONS - 1;
                if (endPage < totalPages) paginationContainer.appendChild(createPageEllipsis());
            } else if (currentPage + maxPagesAfterCurrent >= totalPages -1) {
                startPage = totalPages - (MAX_VISIBLE_BUTTONS - 2);
                endPage = totalPages;
                if (startPage > 1) paginationContainer.appendChild(createPageLink(1, 1, false));
                if (startPage > 2) paginationContainer.appendChild(createPageEllipsis());
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
                paginationContainer.appendChild(createPageLink(1, 1, false));
                if (startPage > 2) paginationContainer.appendChild(createPageEllipsis());
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if( i === 1 && startPage > 1 && totalPages > MAX_VISIBLE_BUTTONS && !(currentPage <= Math.floor((MAX_VISIBLE_BUTTONS - 2) / 2) +1 ) ) continue;
            if( i === totalPages && endPage < totalPages && totalPages > MAX_VISIBLE_BUTTONS && !(currentPage + Math.ceil((MAX_VISIBLE_BUTTONS - 2) / 2) -1 >= totalPages -1) ) continue;

            if (i > 0 && i <= totalPages) {
                 paginationContainer.appendChild(createPageLink(i, i, i === currentPage));
            }
        }

        if (endPage < totalPages && !(currentPage + Math.ceil((MAX_VISIBLE_BUTTONS - 2) / 2)-1 >= totalPages -1) && totalPages > MAX_VISIBLE_BUTTONS) {
            if (endPage < totalPages - 1) {
                paginationContainer.appendChild(createPageEllipsis());
            }
             paginationContainer.appendChild(createPageLink(totalPages, totalPages, false));
        }

        paginationContainer.appendChild(
            createPageLink('Siguiente', currentPage < totalPages ? currentPage + 1 : null, currentPage === totalPages, 'next')
        );
    }

    function createPageLink(text, pageNumber, isActiveOrDisabled, extraClass = '') {
        const link = document.createElement('a');
        link.href = '#';
        link.classList.add('page-link');
        if (extraClass) link.classList.add(extraClass);
        link.textContent = String(text);

        if (pageNumber === null) {
            link.classList.add('disabled');
        } else {
            link.dataset.page = String(pageNumber);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!link.classList.contains('disabled') && currentPage !== pageNumber) {
                    currentPage = pageNumber;
                    displayCurrentPageItems();
                    renderPaginationControls();
                    if (carGrid) {
                         const headerOffset = document.getElementById('header2') ? document.getElementById('header2').offsetHeight : 0;
                         const scrollToPosition = carGrid.offsetTop - headerOffset - 20;
                         window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
                    }
                }
            });
        }

        if (isActiveOrDisabled) {
            if (pageNumber !== null) {
                link.classList.add('active');
            } else {
                link.classList.add('disabled');
            }
        }
        return link;
    }

    function createPageEllipsis() {
        const span = document.createElement('span');
        span.classList.add('page-dots');
        span.textContent = '...';
        return span;
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', updateCarDisplay);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
            brandCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (yearMinInput) yearMinInput.value = '';
            if (yearMaxInput) yearMaxInput.value = '';
            if (mileageSelect) mileageSelect.value = '';
            typeCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (sortSelect) sortSelect.value = 'relevant';
            updateCarDisplay();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', updateCarDisplay);
    }

    const modal = document.getElementById('carDetailModal');
    if (modal) {
        const modalCloseBtn = modal.querySelector('.modal-close-btn');
        const detailButtons = document.querySelectorAll('.details-button');
        // Seleccionar el botón "Contactar al Vendedor" dentro del modal
        const contactSellerButton = modal.querySelector('.contact-button.main-contact');


        function getCarDataForModal(carCard) {
            const carDataFromCard = {};
            carDataFromCard.title = carCard.querySelector('h3')?.textContent || "Auto de Ejemplo";
            const priceTextNode = carCard.querySelector('.car-price');
            if (priceTextNode) {
                carDataFromCard.priceText = priceTextNode.firstChild?.textContent?.trim() || "$0";
            } else {
                carDataFromCard.priceText = "$0";
            }
            const kmTextNode = carCard.querySelector('.car-specs li:nth-child(1)');
            if (kmTextNode) {
                const kmMatch = kmTextNode.textContent.match(/(\d[\d,]*)\s*km/i);
                carDataFromCard.km = kmMatch ? `${kmMatch[1]} km` : (kmTextNode.textContent.replace('KM:', '').trim() || "N/A");
            } else {
                carDataFromCard.km = "N/A";
            }
            carDataFromCard.transmission = carCard.querySelector('.car-specs li:nth-child(2)')?.textContent.replace('Trans:', '').trim() || "N/A";
            carDataFromCard.mainImage = carCard.querySelector('.car-image-container img')?.src || 'https://via.placeholder.com/600x400/EEEEEE/AAAAAA?text=Imagen+Principal';

            carDataFromCard.location = carCard.dataset.location || "Ubicación no disponible";
            carDataFromCard.color = carCard.dataset.color || "N/A";
            carDataFromCard.doors = carCard.dataset.doors || "N/A";
            carDataFromCard.fuel = carCard.dataset.fuel || "N/A";
            carDataFromCard.description = carCard.dataset.description || "Descripción no disponible.";
            carDataFromCard.yearFull = carCard.dataset.year || "N/A";
            carDataFromCard.brandFull = carCard.dataset.brand ? (carCard.dataset.brand.charAt(0).toUpperCase() + carCard.dataset.brand.slice(1)) : "N/A";
            carDataFromCard.modelFull = carCard.dataset.model || "N/A";
            carDataFromCard.versionFull = carCard.dataset.version || "N/A";
            carDataFromCard.conditionFull = carCard.dataset.condition || "N/A";
            const thumbnailsAttr = carCard.dataset.thumbnails;
            // Asegúrate de que si data-thumbnails está vacío o no es una lista válida, se usa la imagen principal como fallback.
            const mainImageFallback = [carDataFromCard.mainImage].filter(Boolean);
            carDataFromCard.thumbnails = thumbnailsAttr ? thumbnailsAttr.split(',').map(t => t.trim()).filter(t => t) : mainImageFallback;
            if (carDataFromCard.thumbnails.length === 0 && carDataFromCard.mainImage) {
                carDataFromCard.thumbnails = mainImageFallback; // Fallback si split resulta en array vacío
            }


            return carDataFromCard;
        }

        const openModal = (carData) => {
            document.getElementById('modalTitle').textContent = carData.title || "Título no disponible";
            document.getElementById('modalPrice').textContent = carData.priceText || "Precio no disponible";
            document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${carData.location || 'Ubicación no disponible'}`;
            document.getElementById('modalMainImage').src = carData.mainImage || 'https://via.placeholder.com/600x400/EEEEEE/AAAAAA?text=Imagen+Principal';
            document.getElementById('modalMainImage').alt = `Imagen principal de ${carData.title || 'auto'}`;

            document.getElementById('modalKm').innerHTML = `<i class="fas fa-tachometer-alt"></i> ${carData.km || 'N/A'}`;
            document.getElementById('modalTransmision').innerHTML = `<i class="fas fa-cogs"></i> ${carData.transmission || 'N/A'}`;

            const modalColorEl = document.getElementById('modalColor');
            if (modalColorEl) modalColorEl.innerHTML = `<i class="fas fa-palette"></i> ${carData.color || 'N/A'}`;

            const modalPuertasEl = document.getElementById('modalPuertas');
            if (modalPuertasEl) modalPuertasEl.innerHTML = `<i class="fas fa-door-closed"></i> ${carData.doors || 'N/A'}`;

            const modalCombustibleEl = document.getElementById('modalCombustible');
            if (modalCombustibleEl) modalCombustibleEl.innerHTML = `<i class="fas fa-gas-pump"></i> ${carData.fuel || 'N/A'}`;

            const modalDescriptionTextEl = document.getElementById('modalDescriptionText');
            if (modalDescriptionTextEl) modalDescriptionTextEl.textContent = carData.description || "Descripción no disponible.";

            const specsGeneralEl = document.getElementById('specsGeneral');
            if (specsGeneralEl) {
                specsGeneralEl.innerHTML = `
                    <li>Año: ${carData.yearFull || 'N/A'}</li>
                    <li>Marca: ${carData.brandFull || 'N/A'}</li>
                    <li>Modelo: ${carData.modelFull || 'N/A'}</li>
                    <li>Versión: ${carData.versionFull || 'N/A'}</li>
                    <li>Condición: ${carData.conditionFull || 'Usado'}</li>
                `;
            }

            const thumbnailsContainer = document.getElementById('modalThumbnails');
            thumbnailsContainer.innerHTML = ''; // Limpiar miniaturas anteriores
            if (carData.thumbnails && carData.thumbnails.length > 0) {
                // Asegurar que la imagen principal también esté en la lista de miniaturas si no hay otras
                 const uniqueThumbnails = Array.from(new Set(carData.thumbnails)); // Evitar duplicados si la principal ya está

                uniqueThumbnails.forEach((thumbUrl, index) => {
                    const img = document.createElement('img');
                    img.src = thumbUrl;
                    img.alt = `Vista miniatura ${index + 1} de ${carData.title || 'auto'}`;
                    img.addEventListener('click', () => {
                        document.getElementById('modalMainImage').src = thumbUrl;
                        thumbnailsContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                        img.classList.add('active');
                    });
                    thumbnailsContainer.appendChild(img);
                });
                // Marcar la primera miniatura como activa si coincide con la imagen principal
                if (thumbnailsContainer.firstChild && document.getElementById('modalMainImage').src === thumbnailsContainer.firstChild.src) {
                    thumbnailsContainer.firstChild.classList.add('active');
                } else if (thumbnailsContainer.firstChild) { // Si no coincide, activa la primera por defecto
                     thumbnailsContainer.firstChild.classList.add('active');
                }

            } else { // Fallback si no hay miniaturas definidas
                const img = document.createElement('img');
                img.src = carData.mainImage || 'https://via.placeholder.com/100x75.webp?text=No+Disponible';
                img.alt = `Vista miniatura de ${carData.title || 'auto'}`;
                img.classList.add('active');
                thumbnailsContainer.appendChild(img);
            }


            modal.removeAttribute('hidden');
            void modal.offsetWidth;
            modal.classList.add('visible');
            document.body.classList.add('modal-open');
        };
        const closeModal = () => {
            modal.classList.remove('visible');
            document.body.classList.remove('modal-open');
            // Esperar a que la transición termine para ocultar con 'hidden'
             modal.addEventListener('transitionend', function handleTransitionEnd() {
                if (!modal.classList.contains('visible')) { // Doble chequeo por si acaso
                    modal.setAttribute('hidden', 'true');
                }
                modal.removeEventListener('transitionend', handleTransitionEnd);
            }, { once: true });
        };

        detailButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const carCard = button.closest('.car-card');
                if (carCard) {
                    const carDataForModal = getCarDataForModal(carCard);
                    openModal(carDataForModal);
                }
            });
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('visible')) closeModal();
        });

        // **** Nueva función para el botón de contacto ****
        if (contactSellerButton) {
            contactSellerButton.addEventListener('click', (event) => {
                event.preventDefault(); // Previene la acción por defecto si es un enlace o formulario
                alert("Solicitud enviada, llegará una respuesta pronto a su correo.");
                // Opcional: Podrías añadir lógica aquí para cerrar el modal después de la alerta,
                // o enviar datos a un servidor (usando fetch/XMLHttpRequest).
                // closeModal(); // Descomentar si quieres cerrar el modal automáticamente
            });
        }
        // **** Fin nueva función ****


        // Asegurar que el año actual en el footer se actualice
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

    } // Fin de if (modal)

}); // Fin de DOMContentLoaded