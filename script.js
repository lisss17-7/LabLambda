const form = document.getElementById("secureForm");
const responseDiv = document.getElementById("responseMessage");

// Sanitiza texto para evitar XSS
function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Previene el envío automático

  // Sanitiza y captura los valores
  const nombre = escapeHTML(form.nombre.value.trim());
  const correo = escapeHTML(form.correo.value.trim());
  const mensaje = escapeHTML(form.mensaje.value.trim());

  // Validación extra (además de la del navegador)
  if (nombre.length < 2 || mensaje.length < 10 || !correo.includes("@")) {
    responseDiv.textContent = "Por favor, completa todos los campos correctamente.";
    responseDiv.style.color = "red";
    return;
  }

  // Envío de datos usando fetch con Content-Type: application/json
  try {
    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, correo, mensaje })
    });

    if (!res.ok) throw new Error("Error en el servidor");

    const data = await res.json(); // Supone que el backend responde con JSON
    responseDiv.textContent = data.message || "Mensaje enviado con éxito. ¡Gracias!";
    responseDiv.style.color = "green";
    form.reset();
  } catch (error) {
    console.error("Error al enviar:", error);
    responseDiv.textContent = "Ocurrió un error al enviar el mensaje. Intenta más tarde.";
    responseDiv.style.color = "red";
  }
});
