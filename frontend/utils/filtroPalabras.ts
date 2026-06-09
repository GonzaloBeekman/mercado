// utils/filtroPalabras.ts

const palabrasProhibidas = [

  'puta',
  'mierda',
  'idiota',
  'pelotudo',
  'boludo',
  'forro',
  'hdp',
  'concha',
  'puto'

];

export const contieneMalasPalabras = (
  texto: string
) => {

  const textoLower =
    texto.toLowerCase();

  return palabrasProhibidas.some(
    palabra =>
      textoLower.includes(palabra)
  );
};