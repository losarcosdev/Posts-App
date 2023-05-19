export const randomWord = () => {
  const palabras = [
    "hola",
    "adiós",
    "perro",
    "gato",
    "casa",
    "nube",
    "mar",
    "sol",
    "luz",
    "noche",
    "azul",
    "verde",
    "rojo",
    "amarillo",
    "blanco",
    "negro",
    "fuego",
    "agua",
    "aire",
    "tierra",
  ];
  const min = 1;
  const max = 10;
  const indice = Math.floor(Math.random() * palabras.length);
  return palabras[indice].substring(
    0,
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};
