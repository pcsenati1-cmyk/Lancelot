// Esperar a que cargue la página
window.addEventListener("load", () => {
    document.querySelector(".card").classList.add("show");
});

// Botón interactivo
const boton = document.getElementById("btn");
const mensaje = document.getElementById("mensaje");

boton.addEventListener("click", () => {
    mensaje.textContent = "🔥 ¡Vas muy bien! Sigue aprendiendo desarrollo web.";
});