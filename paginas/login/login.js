document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-form-section');
    const signupSection = document.getElementById('signup-form-section');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    function switchToSignup() {
        loginSection.style.display = 'none'; // Ocultar inmediatamente
        loginSection.classList.remove('active');

        signupSection.style.display = 'block'; // Hacer visible para la animación
        // Forzar reflow para asegurar que la transición se aplique si display cambió
        void signupSection.offsetWidth;
        signupSection.classList.add('active');
    }

    function switchToLogin() {
        signupSection.style.display = 'none'; // Ocultar inmediatamente
        signupSection.classList.remove('active');

        loginSection.style.display = 'block'; // Hacer visible para la animación
        void loginSection.offsetWidth;
        loginSection.classList.add('active');
    }

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchToSignup();
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }

    // Simulación de envío de formularios
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            if (!email) {
                alert('Por favor, ingresa tu correo electrónico.');
                return;
            }
            alert(`Intento de inicio de sesión con correo: ${email}`);
            // Aquí iría la lógica real de login
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = signupForm.fullname.value;
            const birthyear = signupForm.birthyear.value;
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const confirmPassword = signupForm.confirm_password.value;
            const terms = signupForm.terms.checked;

            if (!fullname || !birthyear || !email || !password || !confirmPassword) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (!terms) {
                alert('Debes aceptar los términos y la política de privacidad.');
                return;
            }
            alert(`Intento de registro para ${fullname} con correo: ${email}`);
            // Aquí iría la lógica real de signup
        });
    }

    // Asegurarse que el formulario de login sea el visible al cargar la página
    if (loginSection && signupSection) { // Asegurarse que ambos existen
        signupSection.style.display = 'none'; // Ocultar signup por defecto
        signupSection.classList.remove('active');

        loginSection.style.display = 'block';
        // Pequeño delay para asegurar que el display:block se aplicó antes de la clase active
        setTimeout(() => loginSection.classList.add('active'), 10);
    }
});