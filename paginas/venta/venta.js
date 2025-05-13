document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de Vender Auto cargada.");

    const form = document.getElementById('sellCarForm');
    const photoInput = document.getElementById('carPhotos');
    const photoPreviewContainer = document.getElementById('photoPreview');
    const carYearSelect = document.getElementById('carYear');
    const carMileageInput = document.getElementById('carMileage');
    const carMileageRawInput = document.getElementById('carMileageRaw');
    const carPriceInput = document.getElementById('carPrice');
    const carPriceRawInput = document.getElementById('carPriceRaw');
    const descriptionTextarea = document.getElementById('carDescription');
    const charCounterSpan = document.getElementById('charCounter');
    const submitButton = form.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');


    // --- Llenar años dinámicamente ---
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    if (carYearSelect && carYearSelect.options.length <= 1) { // Evitar duplicar si ya están en HTML
        carYearSelect.innerHTML = '<option value="" disabled selected>Selecciona</option>'; // Resetear
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            carYearSelect.appendChild(option);
        }
    }

    // --- Función para formatear números con comas ---
    function formatNumberWithCommas(number) {
        // Remover caracteres no numéricos excepto el punto decimal si existe
        let numStr = String(number).replace(/[^\d.]/g, '');
        // Separar parte entera y decimal
        let parts = numStr.split('.');
        // Formatear parte entera con comas
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Unir de nuevo con el punto decimal si existe
        return parts.join('.');
    }

    // --- Formatear Kilometraje ---
    if (carMileageInput && carMileageRawInput) {
        carMileageInput.addEventListener('input', (e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, ''); // Obtener solo dígitos
            carMileageRawInput.value = rawValue; // Guardar valor crudo
            e.target.value = formatNumberWithCommas(rawValue); // Mostrar valor formateado
        });
        // Formatear al cargar si hay valor inicial (ej. en edición)
         if(carMileageInput.value) {
            const rawValue = carMileageInput.value.replace(/[^\d]/g, '');
            carMileageRawInput.value = rawValue;
            carMileageInput.value = formatNumberWithCommas(rawValue);
         }
    }

    // --- Formatear Precio ---
     if (carPriceInput && carPriceRawInput) {
        carPriceInput.addEventListener('input', (e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, '');
            carPriceRawInput.value = rawValue;
            e.target.value = formatNumberWithCommas(rawValue);
        });
         if(carPriceInput.value) {
            const rawValue = carPriceInput.value.replace(/[^\d]/g, '');
            carPriceRawInput.value = rawValue;
            carPriceInput.value = formatNumberWithCommas(rawValue);
         }
    }

    // --- Contador de Caracteres para Descripción ---
    if (descriptionTextarea && charCounterSpan) {
        descriptionTextarea.addEventListener('input', () => {
            const currentLength = descriptionTextarea.value.length;
            const maxLength = descriptionTextarea.maxLength;
            charCounterSpan.textContent = currentLength;
            // Opcional: Cambiar color si se acerca/excede el límite
            if (currentLength > maxLength) {
                charCounterSpan.parentElement.style.color = 'var(--color-error)';
            } else {
                charCounterSpan.parentElement.style.color = 'var(--color-text-secondary)';
            }
        });
        // Inicializar contador al cargar
        charCounterSpan.textContent = descriptionTextarea.value.length;
    }


    // --- Previsualización de Fotos Mejorada ---
    if (photoInput && photoPreviewContainer) {
        const MAX_PHOTOS = 10;
        let currentFiles = []; // Para manejar las fotos subidas

        photoInput.addEventListener('change', (event) => {
            const newFiles = Array.from(event.target.files);
            const totalFiles = currentFiles.length + newFiles.length;

            if (totalFiles > MAX_PHOTOS) {
                alert(`Puedes subir un máximo de ${MAX_PHOTOS} fotos. Has seleccionado ${newFiles.length} nuevas, pero ya tienes ${currentFiles.length}.`);
                // Limpiar la selección actual para evitar confusión
                photoInput.value = ''; // Resetea el input
                return; // Detener proceso
            }

            // Filtrar solo imágenes y añadir a la lista actual
            const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
            currentFiles.push(...imageFiles);

            renderPhotoPreviews(); // Renderizar todas las fotos actuales

             // Resetear el input permite seleccionar los mismos archivos de nuevo si se eliminan
             photoInput.value = '';
        });

        function renderPhotoPreviews() {
            photoPreviewContainer.innerHTML = ''; // Limpiar vista previa
            currentFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('img-preview-wrapper');

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name || 'Previsualización';

                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-img-btn');
                    removeBtn.textContent = '×';
                    removeBtn.type = 'button'; // Evitar que envíe el form
                    removeBtn.title = `Quitar ${file.name}`;
                    removeBtn.addEventListener('click', () => {
                        removeFile(index); // Llama a función para quitar archivo
                    });

                    wrapper.appendChild(img);
                    wrapper.appendChild(removeBtn);
                    photoPreviewContainer.appendChild(wrapper);
                }
                reader.readAsDataURL(file);
            });
        }

        function removeFile(indexToRemove) {
            currentFiles.splice(indexToRemove, 1); // Quitar del array
            renderPhotoPreviews(); // Volver a renderizar
        }
    }


    // --- Validación y Envío ---
    if (form) {
        form.addEventListener('submit', async (event) => { // Hacerla async para esperar fetch (simulado)
            event.preventDefault();
            clearAllErrors(); // Limpiar errores previos

            let isValid = validateForm();

            if (isValid) {
                showLoading(true); // Mostrar loader en botón

                console.log("Formulario válido. Recolectando datos...");
                alert('Datos enviados con éxito');
                const formData = new FormData(form);

                // --- Importante: Añadir archivos al FormData ---
                // Hay que añadir los archivos guardados en `currentFiles`
                currentFiles.forEach((file, index) => {
                    formData.append(`car_photos[${index}]`, file, file.name);
                });
                // Remover el input de archivo original vacío para evitar problemas
                 formData.delete('car_photos[]');


                // Remover valores formateados si existen los 'raw'
                 if (formData.has('car_mileage_raw')) formData.delete('car_mileage');
                 if (formData.has('car_price_raw')) formData.delete('car_price_display');
                 if (formData.has('car_condition_display')) formData.delete('car_condition_display');


                // Mostrar datos finales (para depuración)
                console.log("Datos a enviar:");
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`${key}: ${value.name} (File)`);
                    } else {
                        console.log(`${key}: ${value}`);
                    }
                }

                // Simular envío al servidor
                try {
                    // Aquí iría tu fetch real:
                    // const response = await fetch('/api/sell-car', { method: 'POST', body: formData });
                    // const result = await response.json();
                    // console.log('Respuesta servidor:', result);
                    // if (!response.ok) throw new Error(result.message || 'Error en el servidor');

                    // Simulación:
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar 1.5s

                    alert('¡Oferta solicitada con éxito! (Simulación)');
                    form.reset(); // Limpiar formulario
                    photoPreviewContainer.innerHTML = ''; // Limpiar previsualización
                    currentFiles = []; // Limpiar array de archivos
                    clearAllErrors(); // Asegurarse de limpiar errores visuales

                } catch (error) {
                    console.error('Error al enviar:', error);
                    alert(`Error al enviar el formulario: ${error.message || 'Inténtalo de nuevo.'}`);
                    // Opcional: Mostrar error cerca del botón de submit
                } finally {
                     showLoading(false); // Ocultar loader
                }
                
                

            } else {
                console.warn("El formulario contiene errores.");
                // Scroll al primer error
                const firstErrorField = form.querySelector('.invalid');
                if (firstErrorField) {
                    firstErrorField.focus();
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                 alert('Por favor, revisa los campos marcados en rojo.');
            }
        });
    }

    // --- Funciones de Validación y UI ---

    function validateForm() {
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const group = input.closest('.form-group');
            let fieldValid = true;

            if (input.type === 'checkbox') {
                if (!input.checked) fieldValid = false;
            } else if (input.tagName === 'SELECT') {
                 if (!input.value) fieldValid = false;
            } else { // Input text, number, email, tel, etc.
                if (!input.value.trim()) fieldValid = false;
                // Añadir validaciones específicas si es necesario (ej. email, teléfono)
                if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value.trim())) {
                    showError(input, 'Introduce un correo electrónico válido.');
                    fieldValid = false; // Marcar como inválido incluso si no está vacío
                }
                 if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value.trim())) {
                    showError(input, 'Introduce un teléfono válido (10 dígitos).');
                    fieldValid = false;
                 }
            }

            if (!fieldValid) {
                valid = false;
                // Usar showError para mostrar el mensaje apropiado
                 if (!input.value && input.type !== 'email' && input.type !== 'tel') { // Evitar sobreescribir mensajes específicos
                    showError(input, 'Este campo es obligatorio.');
                 } else if (input.type === 'checkbox' && !input.checked) {
                     showError(input, 'Debes aceptar los términos.');
                 }
            }
        });
        return valid;
    }

    function showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return;
        const errorDiv = formGroup.querySelector('.error-message');
        inputElement.classList.add('invalid');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    function clearError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
         if (!formGroup) return;
        const errorDiv = formGroup.querySelector('.error-message');
        inputElement.classList.remove('invalid');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    function clearAllErrors() {
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

     // Helpers de validación simple (pueden mejorarse)
     function isValidEmail(email) {
        // Expresión regular básica para email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isValidPhone(phone) {
         // Asume 10 dígitos para México
         const phoneRegex = /^\d{10}$/;
         // Quitar espacios o guiones primero
         return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
     }


    // Quitar error al empezar a escribir/cambiar valor
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', () => clearError(input)); // 'input' para la mayoría
        if(input.tagName === 'SELECT' || input.type === 'checkbox') {
            input.addEventListener('change', () => clearError(input)); // 'change' para select y checkbox
        }
    });

    function showLoading(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoader.hidden = false;
            submitButton.classList.add('loading');
        } else {
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.hidden = true;
             submitButton.classList.remove('loading');
        }
    }

    // --- Lógica Futura (Cargar Modelos según Marca) ---
    // const carMakeSelect = document.getElementById('carMake');
    // const carModelInput = document.getElementById('carModel'); // O select
    // if (carMakeSelect && carModelInput) {
    //     carMakeSelect.addEventListener('change', async (event) => {
    //         const selectedMake = event.target.value;
    //         console.log(`Marca: ${selectedMake}. Cargando modelos... (Simulación)`);
    //         // const models = await fetchModelsForMake(selectedMake); // Llamada API real
    //         // updateModelOptions(models);
    //     });
    // }

}); // Fin DOMContentLoaded