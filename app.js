/* El camino a la Independencia · 1810–1816
 * Versión estática (HTML + CSS + JS puro) para GitHub Pages.
 * Requiere MapLibre GL JS (cargado por CDN en index.html) y territorios.json.
 */
(function () {
'use strict';

// ---------- Iconos (Lucide, SVG en línea) ----------
const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  politica: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 2 7h20L12 2z"/>',
  militar: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/><path d="m11 5 6 6"/><path d="m8 8 4 4"/><path d="m5 11 2 2"/>',
  cultura: '<path d="M4 22V4"/><path d="M4 4h13l-2.5 4L17 12H4"/>',
  personas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
};
function icon(name, size, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color || 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
}

const C = {
  politica: { label: 'Política', color: '#5da9e9' },
  militar: { label: 'Campañas', color: '#e98564' },
  cultura: { label: 'Símbolos', color: '#55c6a7' },
  personas: { label: 'Personajes', color: '#c29be6' },
};

const ROLES = {
  'Cornelio Saavedra': 'Presidente',
  'Mariano Moreno': 'Secretario',
  'Manuel Belgrano': 'General',
  'Juan José Paso': 'Secretario',
  'Manuel de Sarratea': 'Triunviro',
  'Feliciano Chiclana': 'Triunviro',
  'Bernardino Rivadavia': 'Político',
  'José de San Martín': 'Gobernador / General',
  'Carlos María de Alvear': 'Político',
  'Antonio Álvarez Jonte': 'Triunviro',
  'Vicente López y Planes': 'Autor',
  'Blas Parera': 'Compositor',
  'Gervasio Antonio de Posadas': 'Director Supremo',
  'José Gervasio Artigas': 'Protector de los Pueblos Libres',
  'Andrés Guacurarí y Artigas': 'Comandante',
  'Ignacio Álvarez Thomas': 'Director Supremo',
  'Juan Martín de Pueyrredón': 'Director Supremo',
  'Francisca Bazán de Laguna': 'Anfitriona',
  'Tomás Godoy Cruz': 'Diputado',
  'Juan José Castelli': 'Vocal / Representante de la Junta',
  'Antonio González Balcarce': 'General',
  'Santiago de Liniers': 'Ex virrey',
  'José Rondeau': 'General',
  'Martín Miguel de Güemes': 'Caudillo / Gobernador de Salta',
  'Baltasar Hidalgo de Cisneros': 'Virrey',
  'Gregorio Funes': 'Deán / Diputado por Córdoba',
  'Guillermo Brown': 'Almirante',
};

// TERRITORIOS: estadísticas y textos. Los polígonos reales se generan con
// scripts/build-territorios.mjs y se cargan desde /territorios.json
const TERRITORIOS = {
  1810: {
    federal: false,
    km2Realista: '2.400.000',
    km2Patriota: '200',
    km2Federal: '0',
    pobRealista: '~700.000',
    pobPatriota: '~45.000',
    pobFederal: '0',
    contexto: 'El Virreinato es inmenso. Los patriotas solo controlan Buenos Aires.',
    exportaciones: { cueros: '1.09 millones', caballos: '296 mil', grasa: '120 mil' },
    contextoEco: 'El puerto de Buenos Aires es el motor económico.'
  },
  1811: {
    federal: false,
    km2Realista: '1.500.000',
    km2Patriota: '100.000',
    km2Federal: '0',
    pobRealista: '~650.000',
    pobPatriota: '~100.000',
    pobFederal: '0',
    contexto: 'Derrota en Huaqui. El Alto Perú vuelve a manos realistas.',
    exportaciones: { cueros: '800 mil', caballos: '200 mil', grasa: '90 mil' },
    contextoEco: 'La guerra interrumpe las rutas comerciales.'
  },
  1812: {
    federal: false,
    km2Realista: '1.500.000',
    km2Patriota: '100.000',
    km2Federal: '0',
    pobRealista: '~650.000',
    pobPatriota: '~100.000',
    pobFederal: '0',
    contexto: 'Tucumán frena el avance realista. El norte se estabiliza.',
    exportaciones: { cueros: '301 mil', caballos: '25 mil', grasa: '40 mil' },
    contextoEco: 'Año crítico: caída total del comercio.'
  },
  1813: {
    federal: true,
    km2Realista: '1.400.000',
    km2Patriota: '220.000',
    km2Federal: '80.000',
    pobRealista: '~600.000',
    pobPatriota: '~120.000',
    pobFederal: '~45.000',
    contexto: 'Instrucciones del Año XIII. Nace la tensión autonomista con Artigas.',
    exportaciones: { cueros: '600 mil', caballos: '150 mil', grasa: '80 mil' },
    contextoEco: 'Recuperación leve. La Asamblea financia la guerra.'
  },
  1814: {
    federal: true,
    km2Realista: '1.000.000',
    km2Patriota: '250.000',
    km2Federal: '120.000',
    pobRealista: '~550.000',
    pobPatriota: '~160.000',
    pobFederal: '~65.000',
    contexto: 'San Martín asume Cuyo. Cae Montevideo, pero se consolida la Liga Federal.',
    exportaciones: { cueros: '750 mil', caballos: '180 mil', grasa: '95 mil' },
    contextoEco: 'La apertura comercial reactiva el puerto.'
  },
  1815: {
    federal: true,
    km2Realista: '900.000',
    km2Patriota: '200.000',
    km2Federal: '210.000',
    pobRealista: '~500.000',
    pobPatriota: '~140.000',
    pobFederal: '~110.000',
    contexto: 'Congreso de Oriente. El Litoral y la Banda Oriental se declaran independientes.',
    exportaciones: { cueros: '850 mil', caballos: '250 mil', grasa: '110 mil' },
    contextoEco: 'El superávit comercial sostiene la revolución.'
  },
  1816: {
    federal: true,
    km2Realista: '600.000',
    km2Patriota: '500.000',
    km2Federal: '180.000',
    pobRealista: '~400.000',
    pobPatriota: '~220.000',
    pobFederal: '~95.000',
    contexto: 'Declaración de la Independencia en Tucumán. Cuyo prepara el Cruce de los Andes.',
    exportaciones: { cueros: '900 mil', caballos: '280 mil', grasa: '130 mil' },
    contextoEco: 'La bonanza económica financia el Cruce de los Andes.'
  }
};

const E = [
  // ===================== 1810 =====================
  { id: 'cabildo-abierto', year: 1810, date: '1810-05-22', title: 'Destitución del virrey Cisneros', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Baltasar Hidalgo de Cisneros', 'Juan José Castelli'], short: 'El Cabildo Abierto resuelve que el virrey cese en el mando.', detail: 'Fin de la autoridad virreinal', source: 'Actas del Cabildo.' },
  { id: 'junta', year: 1810, date: '1810-05-25', title: 'Primera Junta', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Cornelio Saavedra', 'Mariano Moreno', 'Manuel Belgrano'], short: 'Se forma un nuevo gobierno.', detail: 'Cambio de autoridad', source: 'Archivo General.' },
  { id: 'liniers', year: 1810, date: '1810-08-26', title: 'Fusilamiento de Liniers', place: 'Cabeza de Tigre', cat: 'militar', xy: [-62.2, -32.9], people: ['Santiago de Liniers', 'Juan José Castelli'], short: 'Termina la contrarrevolución de Córdoba.', detail: 'Mano dura de la Junta', source: 'Fuentes de la contrarrevolución.', milicia: 'Ejército Auxiliador del Alto Perú', resultado: 'Victoria' },
  { id: 'paraguay', year: 1810, date: '1810-09-01', title: 'Expedición al Paraguay', place: 'Rumbo al Paraguay', cat: 'militar', xy: [-57.6359, -25.2637], people: ['Manuel Belgrano'], short: 'La expedición busca apoyo.', detail: 'Campaña militar', source: 'Fuentes de Belgrano.', milicia: 'Ejército del Norte (en formación)', resultado: 'Derrota' },
  { id: 'suipacha', year: 1810, date: '1810-11-07', title: 'Batalla de Suipacha', place: 'Alto Perú', cat: 'militar', xy: [-65.6, -21.95], people: ['Antonio González Balcarce', 'Juan José Castelli'], short: 'Primera victoria patriota en el Alto Perú.', detail: 'Se abre el camino a Potosí', source: 'Campañas al Alto Perú.', milicia: 'Ejército Auxiliador del Alto Perú', resultado: 'Victoria' },
  { id: 'junta-grande', year: 1810, date: '1810-12-18', title: 'Junta Grande', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Cornelio Saavedra', 'Gregorio Funes'], short: 'Los diputados del interior se incorporan.', detail: 'Ampliación del gobierno', source: 'Documentación de la Junta Grande.' },
  { id: 'misiones', year: 1810, date: '1810-12-30', title: 'Reglamento para Misiones', place: 'Misiones', cat: 'politica', xy: [-55.9, -27.4], people: ['Manuel Belgrano'], short: 'Belgrano dicta disposiciones.', detail: 'Organización política', source: 'Documentación histórica.' },

  // ===================== 1811 =====================
  { id: 'asencio', year: 1811, date: '1811-02-28', title: 'Grito de Asencio', place: 'Asencio, Banda Oriental', cat: 'politica', xy: [-57.9, -33.4], people: ['José Gervasio Artigas'], short: 'Se alzan los orientales contra España.', detail: 'Inicio de la revolución oriental', source: 'Archivo Artigas.' },
  { id: 'moreno-fallece', year: 1811, date: '1811-03-04', title: 'Muerte de Mariano Moreno', place: 'Alta Mar', cat: 'personas', xy: [-38.0, -15.0], people: ['Mariano Moreno'], short: 'Fallece en alta mar.', detail: 'Pérdida de un líder', source: 'Misión diplomática.' },
  { id: 'las-piedras', year: 1811, date: '1811-05-18', title: 'Batalla de Las Piedras', place: 'Las Piedras, Banda Oriental', cat: 'militar', xy: [-56.22, -34.73], people: ['José Gervasio Artigas'], short: 'Artigas derrota a los realistas.', detail: 'Se inicia el cerco de Montevideo', source: 'Archivo Artigas.', stats: { duracion: 'Una jornada', bajasPatriotas: 11, bajasRealistas: 97 }, milicia: 'Milicias Orientales y Ejército de Buenos Aires', resultado: 'Victoria' },
  {
    id: 'huaqui',
    year: 1811,
    date: '1811-06-20',
    title: 'Batalla de Huaqui',
    place: 'Alto Perú',
    cat: 'militar',
    xy: [-68.9, -16.1],
    people: ['Juan José Castelli', 'Antonio González Balcarce'],
    short: 'Derrota militar contundente.',
    detail: 'Pérdida del Alto Perú',
    source: 'Campañas al Alto Perú.',
    stats: { duracion: 'Desconocida', bajasPatriotas: 1000, bajasRealistas: 'Sin datos' },
    milicia: 'Ejército del Norte (Batallón de Castas, Patricios)',
    resultado: 'Derrota'
  },
  { id: 'triunvirato', year: 1811, date: '1811-09-23', title: 'Primer Triunvirato', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Juan José Paso', 'Manuel de Sarratea', 'Feliciano Chiclana', 'Bernardino Rivadavia'], short: 'Centralización del poder.', detail: 'Poder en Buenos Aires', source: 'Documentación del Triunvirato.' },
  { id: 'belgrano-norte', year: 1811, date: '1811-12-01', title: 'Belgrano al Ejército del Norte', place: 'Buenos Aires', cat: 'militar', xy: [-58.3816, -34.6037], people: ['Manuel Belgrano'], short: 'Belgrano asume el mando.', detail: 'Cambio de estrategia', source: 'Ejército del Norte.' },

  // ===================== 1812 =====================
  { id: 'bandera', year: 1812, date: '1812-02-27', title: 'Creación de la bandera', place: 'Rosario', cat: 'cultura', xy: [-60.6393, -32.9468], people: ['Manuel Belgrano'], short: 'Se enarbola la bandera.', detail: 'Identidad nacional', source: 'Monumento a la Bandera.' },
  { id: 'sanmartin-llega', year: 1812, date: '1812-03-01', title: 'Llegada de San Martín', place: 'Buenos Aires', cat: 'personas', xy: [-58.3816, -34.6037], people: ['José de San Martín'], short: 'Regresa al Río de la Plata.', detail: 'Llegada del Libertador', source: 'Fuentes biográficas.' },
  { id: 'granaderos', year: 1812, date: '1812-03-16', title: 'Creación del Regimiento de Granaderos a Caballo', place: 'Buenos Aires', cat: 'militar', xy: [-58.3816, -34.6037], people: ['José de San Martín'], short: 'Nace el cuerpo de caballería de San Martín.', detail: 'Base del futuro Ejército de los Andes', source: 'Fuentes biográficas.', milicia: 'Regimiento de Granaderos a Caballo' },
  { id: 'exodo-jujeno', year: 1812, date: '1812-08-23', title: 'Éxodo Jujeño', place: 'Jujuy', cat: 'militar', xy: [-65.4977, -24.1858], people: ['Manuel Belgrano'], short: 'Abandonar Jujuy.', detail: 'Táctica de guerra', source: 'Fuentes del Éxodo.', milicia: 'Ejército del Norte', resultado: 'Táctica' },
  {
    id: 'tucuman-battle',
    year: 1812,
    date: '1812-09-24',
    title: 'Batalla de Tucumán',
    place: 'Tucumán',
    cat: 'militar',
    xy: [-65.2176, -26.8083],
    people: ['Manuel Belgrano'],
    short: 'Victoria patriota clave.',
    detail: 'Freno realista',
    source: 'Ejército del Norte.',
    stats: { duracion: '2 días', bajasPatriotas: 65, bajasRealistas: 453 },
    milicia: 'Ejército del Norte y Milicias Tucumanas',
    resultado: 'Victoria'
  },
  { id: 'triunvirato-2', year: 1812, date: '1812-10-08', title: 'Segundo Triunvirato', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['José de San Martín', 'Carlos María de Alvear', 'Juan José Paso', 'Antonio Álvarez Jonte'], short: 'Renuncia del Primer Triunvirato.', detail: 'Giro independentista', source: 'Documentación.' },

  // ===================== 1813 =====================
  { id: 'san-lorenzo', year: 1813, date: '1813-02-03', title: 'Combate de San Lorenzo', place: 'San Lorenzo, Santa Fe', cat: 'militar', xy: [-60.74, -32.75], people: ['José de San Martín'], short: 'Bautismo de fuego de los Granaderos.', detail: 'Se frena el desembarco realista', source: 'Fuentes biográficas.', stats: { duracion: 'Unos 15 minutos', bajasPatriotas: 'Sin datos', bajasRealistas: 'Sin datos' }, milicia: 'Regimiento de Granaderos a Caballo', resultado: 'Victoria' },
  {
    id: 'salta',
    year: 1813,
    date: '1813-02-20',
    title: 'Batalla de Salta',
    place: 'Salta',
    cat: 'militar',
    xy: [-65.4117, -24.7821],
    people: ['Manuel Belgrano'],
    short: 'Victoria en Salta.',
    detail: 'Control del norte',
    source: 'Ejército del Norte.',
    stats: { duracion: '3 horas', bajasPatriotas: 103, bajasRealistas: 480 },
    milicia: 'Ejército del Norte y Milicias Salteñas',
    resultado: 'Victoria'
  },
  { id: 'asamblea', year: 1813, date: '1813-01-31', title: 'Asamblea del Año XIII', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Carlos María de Alvear'], short: 'Reformas institucionales.', detail: 'Libertad de vientres, sello y moneda patria', source: 'Asamblea Constituyente.' },
  { id: 'instrucciones-artigas', year: 1813, date: '1813-04-13', title: 'Instrucciones del Año XIII', place: 'Tres Cruces', cat: 'politica', xy: [-56.1645, -34.8833], people: ['José Gervasio Artigas'], short: 'Bases del federalismo.', detail: 'Autonomía y república', source: 'Congreso de Tres Cruces.' },
  { id: 'himno', year: 1813, date: '1813-05-11', title: 'Himno Patriótico', place: 'Buenos Aires', cat: 'cultura', xy: [-58.3816, -34.6037], people: ['Vicente López y Planes', 'Blas Parera'], short: 'Se aprueba la marcha.', detail: 'Unidad nacional', source: 'Fuentes del Himno.' },
  {
    id: 'vilcapugio',
    year: 1813,
    date: '1813-10-01',
    title: 'Batalla de Vilcapugio',
    place: 'Alto Perú',
    cat: 'militar',
    xy: [-66.2, -18.8],
    people: ['Manuel Belgrano'],
    short: 'Derrota militar.',
    detail: 'Retroceso patriota',
    source: 'Alto Perú.',
    stats: { duracion: 'Desconocida', bajasPatriotas: 153, bajasRealistas: 540 },
    milicia: 'Ejército del Norte',
    resultado: 'Derrota'
  },
  {
    id: 'ayohuma',
    year: 1813,
    date: '1813-11-14',
    title: 'Batalla de Ayohuma',
    place: 'Alto Perú',
    cat: 'militar',
    xy: [-66.2, -18.5],
    people: ['Manuel Belgrano'],
    short: 'Nueva derrota.',
    detail: 'Pérdida de posición',
    source: 'Alto Perú.',
    stats: { duracion: 'Desconocida', bajasPatriotas: 400, bajasRealistas: 240 },
    milicia: 'Ejército del Norte',
    resultado: 'Derrota'
  },

  // ===================== 1814 =====================
  { id: 'directorio', year: 1814, date: '1814-01-31', title: 'Creación del Directorio', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Gervasio Antonio de Posadas', 'Carlos María de Alvear'], short: 'Poder unipersonal.', detail: 'Ejecutivo unipersonal', source: 'Directorio.' },
  { id: 'combate-naval-montevideo', year: 1814, date: '1814-05-14', title: 'Combate Naval de Montevideo', place: 'Montevideo', cat: 'militar', xy: [-56.2, -34.93], people: ['Guillermo Brown'], short: 'Brown destruye la escuadra realista.', detail: 'Se define el sitio de Montevideo', source: 'Historia naval argentina.', milicia: 'Escuadra Patriota', resultado: 'Victoria' },
  { id: 'montevideo', year: 1814, date: '1814-06-20', title: 'Rendición de Montevideo', place: 'Montevideo', cat: 'militar', xy: [-56.1645, -34.9011], people: ['Carlos María de Alvear', 'José Gervasio Artigas'], short: 'Cambio militar.', detail: 'Control del Plata', source: 'Sitio de Montevideo.', milicia: 'Ejército de Operaciones y Milicias Orientales', resultado: 'Victoria' },
  { id: 'sanmartin-cuyo', year: 1814, date: '1814-09-06', title: 'San Martín Gobernador de Cuyo', place: 'Mendoza', cat: 'politica', xy: [-68.8458, -32.8895], people: ['José de San Martín'], short: 'Preparación del Cruce.', detail: 'Base del Plan Continental', source: 'Archivo Histórico de Mendoza.' },

  // ===================== 1815 =====================
  { id: 'andresito', year: 1815, date: '1815-01-01', title: 'Andresito y misioneros', place: 'Misiones', cat: 'personas', xy: [-55.9, -27.4], people: ['Andrés Guacurarí y Artigas', 'José Gervasio Artigas'], short: 'Defensa de pueblos.', detail: 'Resistencia federal', source: 'Fuentes regionales.' },
  { id: 'alvear-renuncia', year: 1815, date: '1815-04-15', title: 'Renuncia de Alvear', place: 'Buenos Aires', cat: 'politica', xy: [-58.3816, -34.6037], people: ['Carlos María de Alvear', 'Ignacio Álvarez Thomas'], short: 'Alvear renuncia.', detail: 'Crisis política', source: 'Renuncia de Alvear.' },
  { id: 'guemes-gobernador', year: 1815, date: '1815-05-06', title: 'Güemes, Gobernador de Salta', place: 'Salta', cat: 'personas', xy: [-65.4117, -24.7821], people: ['Martín Miguel de Güemes'], short: 'El cabildo elige a Güemes gobernador.', detail: 'Defensa de la frontera norte', source: 'Guerra Gaucha.' },
  { id: 'congreso-oriente', year: 1815, date: '1815-06-29', title: 'Congreso de Oriente', place: 'Concepción del Uruguay', cat: 'politica', xy: [-58.2333, -32.4833], people: ['José Gervasio Artigas'], short: 'Liga de los Pueblos Libres.', detail: 'Declaración federal', source: 'Congreso del Arroyo de la China.' },
  { id: 'sipe-sipe', year: 1815, date: '1815-11-29', title: 'Batalla de Sipe Sipe', place: 'Alto Perú', cat: 'militar', xy: [-66.35, -17.45], people: ['José Rondeau'], short: 'Tercera campaña al Alto Perú fracasa.', detail: 'Retirada del Ejército del Norte', source: 'Campañas al Alto Perú.', milicia: 'Ejército del Norte', resultado: 'Derrota' },

  // ===================== 1816 =====================
  { id: 'congreso', year: 1816, date: '1816-03-24', title: 'Congreso de Tucumán', place: 'Tucumán', cat: 'politica', xy: [-65.2176, -26.8083], people: ['Juan Martín de Pueyrredón', 'Francisca Bazán de Laguna'], short: 'Se debate la independencia.', detail: 'Debate constituyente', source: 'Congreso.' },
  { id: 'pueyrredon-director', year: 1816, date: '1816-05-03', title: 'Pueyrredón, Director Supremo', place: 'Tucumán', cat: 'politica', xy: [-65.2176, -26.8083], people: ['Juan Martín de Pueyrredón', 'José de San Martín'], short: 'El Congreso elige al nuevo Director.', detail: 'Apoyo al Plan Continental', source: 'Congreso.' },
  { id: 'independencia', year: 1816, date: '1816-07-09', title: 'Declaración de Independencia', place: 'Tucumán', cat: 'politica', xy: [-65.2176, -26.8083], people: ['Juan Martín de Pueyrredón', 'José de San Martín', 'Tomás Godoy Cruz', 'Juan José Paso'], short: 'Nación libre.', detail: '9 de julio de 1816', source: 'Acta de Independencia.' },
  { id: 'invasion-portuguesa', year: 1816, date: '1816-08-19', title: 'Invasión luso-brasileña', place: 'Banda Oriental', cat: 'militar', xy: [-55.8, -32.5], people: ['José Gervasio Artigas'], short: 'Portugal invade la Banda Oriental.', detail: 'Amenaza a la Liga Federal', source: 'Archivo Artigas.', milicia: 'Milicias Orientales', resultado: 'Derrota' },
];

const PEOPLE = ['Todas', ...new Set(E.flatMap(x => x.people))].sort((a, b) =>
  a === 'Todas' ? -1 : b === 'Todas' ? 1 : a.localeCompare(b, 'es')
);

const YEARS = [1810, 1811, 1812, 1813, 1814, 1815, 1816];

// Helper de coincidencia (misma lógica que usa el filtro de eventos)
const matchEvent = (e, { year, cat, person, q }) =>
  (year === null || e.year === year) &&
  (cat === 'todas' || e.cat === cat) &&
  (person === 'Todas' || e.people.includes(person)) &&
  `${e.title} ${e.place} ${e.people.join(' ')}`
    .toLowerCase()
    .includes(q.toLowerCase());

// SVG INLINE
const SVG_POLITICA = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 2 7h20L12 2z"/></svg>`;
const SVG_MILITAR = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/><path d="m11 5 6 6"/><path d="m8 8 4 4"/><path d="m5 11 2 2"/></svg>`;
const SVG_CULTURA = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4"/><path d="M4 4h13l-2.5 4L17 12H4"/></svg>`;
const SVG_PERSONAS = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 1 0 7.75"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const SVG_CUEROS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4c2 2 4 1 7 1s5 1 7-1c1 3 1 6 0 8-1 2-1 4 0 6-2 2-4 1-7 1s-5 1-7-1c1-2 1-4 0-6-1-2-1-5 0-8z"/></svg>`;
const SVG_CABALLOS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21c0-6 2-10 6-12V6l-2-2 3-2 3 3v3c0 1 .5 2 1 3l2 4c.5 1 1 2 1 4h-3l-1-3-2-1-1 4c-.5 2-2 3-4 3H5z"/><circle cx="14" cy="8" r=".6" fill="currentColor"/></svg>`;
const SVG_GRASA = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a6.5 6.5 0 0 0 6.5-6.5c0-2-1-3.8-3-5.5s-3.2-3.5-3.5-5.5c-.3 2-1.5 3.8-3.5 5.5S5.5 12.5 5.5 14.5 7.5 21 12 21z" fill-opacity="0.85"/></svg>`;


// ---------- Utilidades ----------
const $ = (sel, root) => (root || document).querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMPTY = { type: 'FeatureCollection', features: [] };
const HOME = { center: [-52.2, -28.5], zoom: 3.5, pitch: 0, bearing: 0 };
const YEAR_LABELS = {
  1810: 'Junta', 1811: 'Campañas', 1812: 'Bandera', 1813: 'Himno / Artigas',
  1814: 'Cuyo / M’video', 1815: 'Liga Federal', 1816: 'Independencia',
};

// ---------- Estado ----------
const state = {
  year: 1810,        // null = todos los años
  cat: 'todas',
  person: 'Todas',
  q: '',
  selected: null,
  mobileFilters: false,
  sourcesOpen: false,
};
let geo = null;
let map = null;
let mapReady = false;
let markers = [];
let searchTimer = null;
let lastCurrentId = null;

function getEvents() {
  return E.filter(e => matchEvent(e, state)).sort((a, b) => new Date(a.date) - new Date(b.date));
}
function getCurrent(events) {
  return events.find(e => e.id === state.selected) || null;
}

// ---------- Esqueleto de la página ----------
function buildShell() {
  $('#root').innerHTML = `
  <main class="app">
    <header class="header">
      <div class="brand">
        <span class="sun">☼</span>
        <div class="brand-text">
          <h1>Camino a la Independencia</h1>
          <span class="app-slogan">Sean eternos los laureles que supimos conseguir</span>
        </div>
      </div>
      <div class="header-right">
        <button class="reset" id="btn-reset">${icon('rotate', 14)} Reiniciar</button>
        <button class="mobile-filter" id="btn-mobile"></button>
      </div>
    </header>

    <section class="layout">
      <aside class="filters" id="filters">
        <div class="eyebrow">${icon('filter', 13)} EXPLORAR</div>
        <h2>Filtrar historia</h2>
        <label class="label">Categoría</label>
        <div class="categories" id="categories"></div>

        <label class="label" for="person">Persona</label>
        <select id="person">${PEOPLE.map(p => `<option>${esc(p)}</option>`).join('')}</select>

        <label class="label" for="search">Buscar</label>
        <div class="search">
          ${icon('search', 14)}
          <input id="search" placeholder="Lugar, evento, persona…" autocomplete="off" />
        </div>

        <div class="filter-foot">
          <span>DATOS DE MUESTRA</span>
          <span id="count-results"></span>
        </div>
      </aside>

      <div class="sources-external-container">
        <button class="sources-external-btn" id="btn-sources" title="Ver fuentes oficiales y académicas">
          ${icon('book', 13)} Fuentes de datos
        </button>
        <div class="sources-external-popup" id="sources-popup" hidden>
          <div class="sources-popup-header">
            <span>FUENTES Y REPOSITORIOS</span>
            <button id="btn-sources-close">${icon('x', 12)}</button>
          </div>
          <div class="sources-popup-content">
            <div class="source-section">
              <strong>1. Archivo General de la Nación (AGN)</strong>
              <p>Documentos oficiales, congresos y constituyentes:</p>
              <a href="https://www.argentina.gob.ar/sites/default/files/congreso_constituyente_y_fondo_sanchez_de_bustamante.pdf#1#26#1" target="_blank" rel="noreferrer">Congreso Constituyente y Fondo Sánchez de Bustamante ${icon('external', 10)}</a>
              <a href="https://www.argentina.gob.ar/sites/default/files/bicentenario_de_la_asamblea_xiii_e_independencia.pdf#1#69#1" target="_blank" rel="noreferrer">Bicentenario de la Asamblea del XIII e Independencia ${icon('external', 10)}</a>
            </div>
            <div class="source-section">
              <strong>2. Fuentes Documentales e Históricas</strong>
              <p>Academia Nacional de la Historia:</p>
              <a href="https://repositorio.anh.org.ar/jspui/bitstream/anh/49/1/BaANH44812_Historia_de_la_Nacion_Argentina_5_%28parte_2%29_-_Academia_Nacional_de_la_Historia.pdf#139#140#139" target="_blank" rel="noreferrer">Historia de la Nación Argentina (Tomo V, Parte 2) ${icon('external', 10)}</a>
            </div>
            <div class="source-section">
              <strong>3. Datos Económicos y Población</strong>
              <p>Investigaciones de historia económica y demográfica:</p>
              <a href="https://ravignanidigital.com.ar/_bol_ravig/n20/n20a03.pdf#3#8#3" target="_blank" rel="noreferrer">Boletín del Instituto de Historia Argentina y Americana Dr. Emilio Ravignani ${icon('external', 10)}</a>
            </div>
          </div>
        </div>
      </div>

      <section class="map-area">
        <div class="map-box">
          <div class="map" id="map"></div>
          <div class="map-legend">
            ${Object.values(C).map(v => `<span><i style="background:${v.color}"></i>${v.label}</span>`).join('')}
            <span style="margin-top:4px;border-top:1px solid rgba(255,255,255,0.2);padding-top:4px"><i style="background:#5da9e9;border:1px solid #fff"></i> Patriotas</span>
            <span><i style="background:#c29be6;border:1px solid #fff"></i> Federales</span>
            <span><i style="background:#e98564;border:1px solid #fff;opacity:0.6"></i> Realistas</span>
          </div>
        </div>

        <div id="overlays"></div>
        <div id="event-overlay"></div>

        <div class="timeline">
          <div class="timeline-top">
            <div><small>CRONOLOGÍA</small><strong>Seis años decisivos</strong></div>
            <button class="show-all-btn" id="btn-all" title="Mostrar todos los eventos">${icon('globe', 12)} Mostrar todos</button>
          </div>
          <div class="years" id="years"></div>
        </div>
      </section>

      <aside class="story">
        <div class="story-head">
          <div><small>LECTURA DE DATOS</small><h2>Eventos</h2></div>
          <span id="story-count"></span>
        </div>
        <div id="story-content"></div>
      </aside>
    </section>
  </main>`;
}

// ---------- Renderizado por partes ----------
function renderHeader() {
  $('#btn-mobile').innerHTML = `${icon(state.mobileFilters ? 'x' : 'menu', 16)} Filtros`;
  $('#filters').classList.toggle('show', state.mobileFilters);
}

function renderCategories() {
  const inYear = E.filter(e => state.year === null || e.year === state.year);
  let html = `<button data-cat="todas" class="${state.cat === 'todas' ? 'on' : ''}">${icon('layers', 15)} Todo <b>${inYear.length}</b></button>`;
  for (const [k, v] of Object.entries(C)) {
    html += `<button data-cat="${k}" class="${state.cat === k ? 'on' : ''}">${icon(k, 15, v.color)}${v.label}<b>${inYear.filter(e => e.cat === k).length}</b></button>`;
  }
  $('#categories').innerHTML = html;
}

function renderYears() {
  $('#years').innerHTML = YEARS.map(y => `
    <button data-year="${y}" class="${state.year === y ? 'active' : ''}">
      <span>${y === 1816 ? '★' : y === 1812 ? '✦' : '•'}</span>
      <b>${y}</b>
      <small>${YEAR_LABELS[y]}</small>
    </button>`).join('');
  const all = $('#btn-all');
  all.classList.toggle('active', state.year === null);
  all.disabled = state.year === null;
}

function renderOverlays() {
  const t = state.year && TERRITORIOS[state.year];
  if (!t) { $('#overlays').innerHTML = ''; return; }
  const box = (cls, title, km, hab) => `
    <div class="territory-box ${cls}">
      <span class="territory-title">${title}</span>
      <div class="territory-row"><span class="territory-label">Km²</span><span class="territory-val">${esc(km)}</span></div>
      <div class="territory-row"><span class="territory-label">Hab.</span><span class="territory-val">${esc(hab)}</span></div>
    </div>`;
  const eco = (svg, val, label) => `
    <div class="economy-item">
      <div class="economy-circle"><span class="economy-value">${esc(val)}</span></div>
      <div class="economy-label"><span class="economy-icon" style="color:#5da9e9">${svg}</span>${label}</div>
    </div>`;
  $('#overlays').innerHTML = `
    <div class="stats-overlay">
      <div class="stats-header"><span>TERRITORIO ${state.year}</span></div>
      <div class="territory-comparison">
        ${box('patriota', 'Patriotas', t.km2Patriota, t.pobPatriota)}
        ${t.federal ? box('federal', 'Federales', t.km2Federal, t.pobFederal) : ''}
        ${box('realista', 'Realistas', t.km2Realista, t.pobRealista)}
      </div>
      <div class="territory-context">${esc(t.contexto)}</div>
    </div>
    <div class="economy-overlay">
      <div class="economy-title">EXPORTACIONES</div>
      <div class="economy-grid">
        ${eco(SVG_CUEROS, t.exportaciones.cueros, 'Cueros')}
        ${eco(SVG_CABALLOS, t.exportaciones.caballos, 'Caballos')}
        ${eco(SVG_GRASA, t.exportaciones.grasa, 'Grasa')}
      </div>
      <div class="economy-context">${esc(t.contextoEco)}</div>
    </div>`;
}

function renderEventOverlay(current) {
  const host = $('#event-overlay');
  if (!current) { host.innerHTML = ''; return; }
  const r = current.resultado;
  host.innerHTML = `
    <div class="event-overlay">
      <h2 class="overlay-title">${esc(current.title)}</h2>
      <div class="overlay-data">
        ${r ? `<div class="overlay-resultado ${esc(r.toLowerCase())}">${esc(r)}</div>` : ''}
        <div class="overlay-people-list">
          ${current.people.map(p => `
            <div class="overlay-person-item">
              <span class="overlay-person-name">${esc(p)}</span>
              <span class="overlay-person-role">${esc(ROLES[p] || 'Partícipe')}</span>
            </div>`).join('')}
        </div>
        ${current.milicia ? `<div class="overlay-milicia"><span class="overlay-milicia-label">Fuerzas</span><span class="overlay-milicia-val">${esc(current.milicia)}</span></div>` : ''}
        ${current.stats ? `
          <div class="overlay-stats-grid">
            <div class="overlay-stat-item"><span class="overlay-stat-label">Duración</span><span class="overlay-stat-value">${esc(current.stats.duracion)}</span></div>
            <div class="overlay-stat-item"><span class="overlay-stat-label">Bajas Patriotas</span><span class="overlay-stat-value" style="color:#5da9e9">${esc(current.stats.bajasPatriotas)}</span></div>
            <div class="overlay-stat-item"><span class="overlay-stat-label">Bajas Realistas</span><span class="overlay-stat-value" style="color:#e98564">${esc(current.stats.bajasRealistas)}</span></div>
          </div>` : ''}
      </div>
    </div>`;
}

function renderStory(events, current) {
  $('#story-count').innerHTML = `${String(events.length).padStart(2, '0')} <small>eventos</small>`;
  const host = $('#story-content');
  if (!events.length) {
    host.innerHTML = `
      <div class="no-results">
        ${icon('search', 24)}
        <b>Sin coincidencias</b>
        <span>Probá cambiar los filtros.</span>
        <button id="btn-noresults-reset">Restablecer filtros</button>
      </div>`;
    return;
  }
  host.innerHTML = `<div class="story-body">${events.map(e => {
    const shown = e.people.slice(0, 3).map(p =>
      `<div class="mini-avatar">${esc(p.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase())}</div>`).join('');
    const more = e.people.length > 3 ? `<div class="mini-avatar more">+${e.people.length - 3}</div>` : '';
    return `
      <div class="story-card ${current && current.id === e.id ? 'active' : ''}" data-id="${esc(e.id)}">
        <div class="story-card-icon" style="--c:${C[e.cat].color}">${icon(e.cat, 18)}</div>
        <div class="story-card-content">
          <div class="story-meta">
            <span class="story-category" style="--c:${C[e.cat].color}">${C[e.cat].label}</span>
            <span class="story-date">${e.date.split('-').reverse().join('.')}</span>
            ${e.resultado ? `<span class="story-resultado ${esc(e.resultado.toLowerCase())}">${esc(e.resultado)}</span>` : ''}
          </div>
          <h3 class="story-title">${esc(e.title)}</h3>
          <div class="story-footer">
            <div class="story-place">${icon('pin', 12)} ${esc(e.place)}</div>
            <div class="story-people-avatars" title="${esc(e.people.join(', '))}">${shown}${more}</div>
          </div>
        </div>
      </div>`;
  }).join('')}</div>`;
}

// ---------- Mapa ----------
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-saturation': -0.28, 'raster-contrast': 0.08 } }],
    },
    ...HOME,
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'bottom-right');
  map.on('click', resetCamera);

  map.on('load', () => {
    map.addSource('connections', { type: 'geojson', data: EMPTY });
    map.addLayer({
      id: 'connections-layer', type: 'line', source: 'connections',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#f0cd8f', 'line-width': 3, 'line-dasharray': [2, 1.5], 'line-opacity': 0.8 },
    });

    const bandos = [
      ['realista', '#e98564', 0.15, 1.5, 0.75],
      ['patriota', '#5da9e9', 0.3, 2, 0.95],
      ['federal', '#c29be6', 0.3, 2, 0.95],
    ];
    for (const [b, color, fillOp, w, lineOp] of bandos) {
      map.addSource(`territory-${b}`, { type: 'geojson', data: EMPTY });
      map.addLayer({ id: `territory-${b}-fill`, type: 'fill', source: `territory-${b}`, paint: { 'fill-color': color, 'fill-opacity': fillOp } });
      map.addLayer({
        id: `territory-${b}-line`, type: 'line', source: `territory-${b}`,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': color, 'line-width': w, 'line-opacity': lineOp },
      });
    }
    mapReady = true;
    renderMap();
  });
}

function resetCamera() {
  setSelected(null);
  if (map) map.flyTo({ ...HOME, duration: 1500 });
}

function renderTerritories() {
  if (!mapReady) return;
  const data = state.year && geo ? geo[state.year] : null;
  for (const b of ['realista', 'patriota', 'federal']) {
    const src = map.getSource(`territory-${b}`);
    if (src) src.setData((data && data[b]) || EMPTY);
  }
}

function renderConnections() {
  if (!mapReady) return;
  const src = map.getSource('connections');
  if (!src) return;
  const pool = state.year === null ? [] : E.filter(e => e.year === state.year);
  const ordered = pool.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const features = [];
  for (let i = 1; i < ordered.length; i++) {
    const p = ordered[i - 1], c = ordered[i];
    if (p.xy[0] === c.xy[0] && p.xy[1] === c.xy[1]) continue;
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [p.xy, c.xy] } });
  }
  src.setData({ type: 'FeatureCollection', features });
}

function renderMarkers(events, current) {
  if (!mapReady) return;
  markers.forEach(m => m.remove());
  markers = [];

  const groups = {};
  events.forEach(e => {
    const key = `${e.xy[0].toFixed(4)},${e.xy[1].toFixed(4)}`;
    (groups[key] = groups[key] || []).push(e);
  });

  Object.values(groups).forEach(group => {
    group.forEach((e, i) => {
      const el = document.createElement('div');
      el.className = 'marker' + (current && current.id === e.id ? ' chosen' : '');
      el.style.setProperty('--c', C[e.cat].color);
      el.title = e.title;
      el.innerHTML = { politica: SVG_POLITICA, militar: SVG_MILITAR, cultura: SVG_CULTURA, personas: SVG_PERSONAS }[e.cat];
      el.addEventListener('click', evt => { evt.stopPropagation(); setSelected(e.id); });

      let xy = e.xy;
      if (group.length > 1) {
        const angle = (i / group.length) * 2 * Math.PI;
        xy = [e.xy[0] + Math.cos(angle) * 0.08, e.xy[1] + Math.sin(angle) * 0.08];
      }
      markers.push(new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat(xy).addTo(map));
    });
  });
}

function renderMap() {
  const events = getEvents();
  renderTerritories();
  renderConnections();
  renderMarkers(events, getCurrent(events));
}

// ---------- Render general ----------
function render() {
  const events = getEvents();
  const current = getCurrent(events);

  renderHeader();
  renderCategories();
  renderYears();
  renderOverlays();
  renderEventOverlay(current);
  renderStory(events, current);
  $('#count-results').textContent = `${events.length} resultados`;
  $('#sources-popup').hidden = !state.sourcesOpen;

  renderMap();

  // Vuela hacia el evento solo cuando cambia la selección
  const id = current ? current.id : null;
  if (id && id !== lastCurrentId && mapReady) {
    map.flyTo({
      center: current.xy, zoom: 8.5, pitch: 65, bearing: -20,
      padding: { top: 0, bottom: 300, left: 0, right: 0 },
      duration: 2500, essential: true,
    });
  }
  lastCurrentId = id;
}

// ---------- Acciones ----------
function setSelected(id) {
  state.selected = id;
  render();
}

function reset() {
  state.year = 1810; state.cat = 'todas'; state.person = 'Todas'; state.q = '';
  $('#person').value = 'Todas';
  $('#search').value = '';
  resetCamera();
}

function ensureResultsVisible(nextPerson, nextQ) {
  state.selected = null;
  if (state.year === null) return;
  const next = { cat: state.cat, person: nextPerson, q: nextQ };
  if (E.some(e => matchEvent(e, { ...next, year: state.year }))) return;
  if (E.some(e => matchEvent(e, { ...next, year: null }))) state.year = null;
}

// Lleva el mapa hacia los resultados de una búsqueda por persona o texto
function focusResults() {
  clearTimeout(searchTimer);
  if (!mapReady) return;
  if (state.person === 'Todas' && state.q.trim() === '') return;
  searchTimer = setTimeout(() => {
    const events = getEvents();
    if (!events.length) return;
    const coords = events.map(e => e.xy);
    const unique = new Set(coords.map(c => `${c[0]},${c[1]}`));
    const noPad = { top: 0, bottom: 0, left: 0, right: 0 };
    if (unique.size === 1) {
      map.flyTo({ center: coords[0], zoom: 8, pitch: 0, bearing: 0, padding: noPad, duration: 1800, essential: true });
    } else {
      const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
      coords.forEach(c => bounds.extend(c));
      map.fitBounds(bounds, {
        padding: { top: 90, bottom: 220, left: 70, right: 70 },
        maxZoom: 8, pitch: 0, bearing: 0, duration: 1800, essential: true,
      });
    }
  }, state.q.trim() !== '' ? 500 : 0);
}

// ---------- Eventos de la interfaz ----------
function bindEvents() {
  $('#btn-reset').addEventListener('click', reset);
  $('#btn-mobile').addEventListener('click', () => { state.mobileFilters = !state.mobileFilters; renderHeader(); });

  $('#btn-sources').addEventListener('click', () => { state.sourcesOpen = !state.sourcesOpen; $('#sources-popup').hidden = !state.sourcesOpen; });
  $('#btn-sources-close').addEventListener('click', () => { state.sourcesOpen = false; $('#sources-popup').hidden = true; });

  $('#categories').addEventListener('click', ev => {
    const b = ev.target.closest('button[data-cat]');
    if (!b) return;
    const k = b.dataset.cat;
    state.cat = k === 'todas' ? 'todas' : (state.cat === k ? 'todas' : k);
    render();
  });

  $('#person').addEventListener('change', ev => {
    state.person = ev.target.value;
    ensureResultsVisible(state.person, state.q);
    render();
    focusResults();
  });

  $('#search').addEventListener('input', ev => {
    state.q = ev.target.value;
    ensureResultsVisible(state.person, state.q);
    render();
    focusResults();
  });

  $('#years').addEventListener('click', ev => {
    const b = ev.target.closest('button[data-year]');
    if (!b) return;
    const y = Number(b.dataset.year);
    if (state.year === y) return;
    state.year = y;
    state.selected = null;
    render();
  });

  $('#btn-all').addEventListener('click', () => { state.year = null; state.selected = null; render(); });

  $('#story-content').addEventListener('click', ev => {
    if (ev.target.closest('#btn-noresults-reset')) { reset(); return; }
    const card = ev.target.closest('.story-card');
    if (card) setSelected(card.dataset.id);
  });
}

// ---------- Arranque ----------
buildShell();
bindEvents();
render();
initMap();

fetch('territorios.json')
  .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
  .then(d => { geo = d; renderTerritories(); })
  .catch(err => console.error('No se pudo cargar territorios.json:', err));

})();
