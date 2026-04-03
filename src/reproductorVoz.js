// src/reproductorVoz.js

export const reproduirParaulaEnAngles = (paraula) => {
  const sintesi = window.speechSynthesis;
  sintesi.cancel(); // Para cualquier sonido anterior

  const utterance = new SpeechSynthesisUtterance(paraula);
  utterance.lang = 'en-US'; // Pronunciación en inglés (puedes cambiar a 'en-GB' para británico)
  utterance.rate = 0.85; // Un poco más lento de lo normal para que los niños lo entiendan bien
  utterance.pitch = 1.1; // Tono un poquito más agudo/amigable

  sintesi.speak(utterance);
};