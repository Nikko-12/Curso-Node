// Función para validar la contraseña
function validarPassword(password) {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /\d/.test(password);
    return tieneMayuscula && tieneNumero;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Formulario de registro
    const signupForm = document.getElementById("signupForm");
  
    if (signupForm) {
      signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const nombre = signupForm.nombre.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
  
        if (!validarPassword(password)) {
          document.getElementById("mensaje").textContent =
            "La contraseña debe contener al menos una letra mayúscula y un número.";
          return;
        }
  
        const data = { nombre, email, password };
  
        try {
          const respuesta = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
  
          const resultado = await respuesta.text();
          document.getElementById("mensaje").textContent = resultado;
        } catch (error) {
          document.getElementById("mensaje").textContent = "Error al enviar.";
          console.error(error);
        }
      });
    }
  
    // Formulario de login
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const email = loginForm.email.value;
        const password = loginForm.password.value;
  
        // Validación de contraseña en login (opcional si lo deseas)
        if (!validarPassword(password)) {
          document.getElementById("mensajeLogin").textContent =
            "La contraseña debe contener al menos una letra mayúscula y un número.";
          return;
        }
  
        try {
          const respuesta = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
  
          const resultado = await respuesta.text();
          document.getElementById("mensajeLogin").textContent = resultado;
        } catch (error) {
          document.getElementById("mensajeLogin").textContent = "Error al iniciar sesión.";
          console.error(error);
        }
      });
    }
  });
  
  
  
  