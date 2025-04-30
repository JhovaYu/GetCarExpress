document.addEventListener('DOMContentLoaded', () => {
    console.log("Página Mi Cuenta cargada.");

    const navLinks = document.querySelectorAll('.account-nav .nav-link');
    const contentSections = document.querySelectorAll('.account-section');
    const sectionContainer = document.getElementById('account-section-content'); // Contenedor de secciones

    // --- Lógica para cambiar entre secciones ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Evitar comportamiento por defecto solo si no es el link de logout
            if (!link.classList.contains('logout-link')) {
                event.preventDefault();
            } else {
                // Aquí podrías añadir lógica de confirmación antes de seguir el enlace de logout
                console.log("Click en Cerrar Sesión");
                // return; // Deja que el navegador siga el href="#cerrar-sesion" o maneja con JS
            }

            const targetId = link.getAttribute('data-target');
            if (!targetId || targetId === 'cerrar-sesion') {
                // Si es logout o no tiene target válido, no cambies de sección visualmente aquí
                 if(targetId === 'cerrar-sesion') {
                    // Lógica de Logout Real (ej: redirección, llamada a API)
                     alert('Simulación: Cerrando sesión...');
                     // window.location.href = '/logout'; // Ejemplo
                 }
                return;
            }


            // Quitar clase activa de todos los links y secciones
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => {
                section.classList.remove('active-section');
                section.hidden = true; // Ocultar explícitamente
            });

            // Añadir clase activa al link clickeado
            link.classList.add('active');

            // Mostrar la sección correspondiente
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.hidden = false; // Mostrar
                // Forzar reflow para animación si es necesario
                // void targetSection.offsetWidth;
                targetSection.classList.add('active-section');
                 // Opcional: scroll al inicio de la sección si es muy larga
                 // targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.warn(`Sección objetivo no encontrada: #${targetId}`);
            }
        });
    });

    // --- Lógica adicional (Ejemplo: botón Editar/Guardar en Datos Personales) ---
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const editButton = profileForm.querySelector('.edit-button');
        const saveButton = profileForm.querySelector('.save-button');
        const editableInputs = profileForm.querySelectorAll('input:not([type="email"])'); // Hacer email no editable?

        if (editButton && saveButton) {
            editButton.addEventListener('click', () => {
                editableInputs.forEach(input => input.readOnly = false);
                saveButton.hidden = false;
                editButton.hidden = true;
                // Opcional: Enfocar el primer campo editable
                editableInputs[0]?.focus();
                 // Añadir clase para cambiar estilos si es necesario
                 profileForm.classList.add('editing');
            });

            // Lógica para guardar (simulada)
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                 // Aquí iría la validación y el envío (Fetch/AJAX)
                console.log('Guardando cambios (simulación)...');
                alert('Datos guardados (simulación)');

                editableInputs.forEach(input => input.readOnly = true);
                saveButton.hidden = true;
                editButton.hidden = false;
                profileForm.classList.remove('editing');
            });
        }
    }


    // --- Inicializar Año en Footer ---
    const currentYearElementAccount = document.getElementById('current-year-account');
    if (currentYearElementAccount) {
        currentYearElementAccount.textContent = new Date().getFullYear();
    }

}); // Fin DOMContentLoaded