import { useState, useEffect } from 'react';
import { obtenirVocabulari } from './api';
import { reproduirParaulaEnAngles } from './reproductorVoz';

function App() {
  const [vocabularies, setVocabularies] = useState(null);
  const [carregant, setCarregant] = useState(true);
  
  // Hemos mejorado los controles para poder guardar listas personalizadas como el MIX
  const [unitatSeleccionada, setUnitatSeleccionada] = useState(null);
  const [paraulesSessio, setParaulesSessio] = useState([]); // Guarda las palabras de la ronda actual
  const [indexFitxa, setIndexFitxa] = useState(0);
  const [mostrarParaula, setMostrarParaula] = useState(false);

  useEffect(() => {
    obtenirVocabulari().then(dades => {
      setVocabularies(dades);
      setCarregant(false);
    });
  }, []);

  // Iniciar una unidad normal
  const iniciarUnitat = (unitat) => {
    setUnitatSeleccionada(unitat);
    setParaulesSessio(vocabularies[unitat]);
    setIndexFitxa(0);
    setMostrarParaula(false);
  };

  // NUEVO: La magia del botón MIX
  const iniciarMix = () => {
    let totesLesParaules = [];
    
    // 1. Metemos todas las palabras en el mismo saco
    Object.values(vocabularies).forEach(llista => {
      totesLesParaules = totesLesParaules.concat(llista);
    });

    // 2. Las mezclamos al azar
    totesLesParaules.sort(() => Math.random() - 0.5);

    // 3. Preparamos el juego
    setUnitatSeleccionada('MIX 🔀');
    setParaulesSessio(totesLesParaules);
    setIndexFitxa(0);
    setMostrarParaula(false);
  };

  const revelarIEscoltar = (paraula) => {
    setMostrarParaula(true);
    reproduirParaulaEnAngles(paraula);
  };

  const seguentFitxa = () => {
    // Ahora leemos la longitud de la sesión actual, no de la unidad del Excel
    if (indexFitxa < paraulesSessio.length - 1) {
      setIndexFitxa(indexFitxa + 1);
      setMostrarParaula(false);
    } else {
      alert("Molt bé! Has repassat totes les paraules! 🎉");
      setUnitatSeleccionada(null);
    }
  };

  // --- PANTALLA DE CARGA ---
  if (carregant) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center font-sans">
        <h2 className="text-3xl font-bold text-blue-500 animate-pulse uppercase">Carregant... ⏳</h2>
      </div>
    );
  }

  // --- PANTALLA DEL JUEGO (FICHAS) ---
  if (unitatSeleccionada) {
    const fitxaActual = paraulesSessio[indexFitxa];

    return (
      <div className="min-h-screen bg-sky-100 flex flex-col items-center py-12 px-4 font-sans">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 uppercase">
          {unitatSeleccionada} ({indexFitxa + 1} / {paraulesSessio.length})
        </h2>

        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full flex flex-col items-center border-4 border-blue-200 min-h-[400px] justify-center">
          
          <img 
            key={fitxaActual.english} 
            src={`/imatges/${fitxaActual.image_url}`} 
            alt={`Imatge de ${fitxaActual.english}`} 
            className="h-48 object-contain mb-6"
          />

          {mostrarParaula ? (
            <div className="text-5xl font-extrabold text-blue-800 tracking-widest text-center mt-4">
              {fitxaActual.english}
            </div>
          ) : (
            <div className="text-2xl text-gray-400 font-medium p-6 border-4 border-dashed border-gray-200 rounded-2xl mt-4 w-full text-center uppercase">
              Pensa la paraula... 🧠
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md">
          {!mostrarParaula ? (
            <button 
              onClick={() => revelarIEscoltar(fitxaActual.english)} 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-2xl font-extrabold py-5 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 uppercase"
            >
              🔊 VEURE I ESCOLTAR
            </button>
          ) : (
            <button 
              onClick={seguentFitxa} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-2xl font-extrabold py-5 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 uppercase"
            >
              SEGÜENT ➡️
            </button>
          )}

          <button 
            onClick={() => setUnitatSeleccionada(null)} 
            className="mt-6 text-gray-500 hover:text-gray-700 font-bold uppercase underline"
          >
            🔙 Tornar al menú
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA DEL MENÚ PRINCIPAL ---
  const llistaUnitats = Object.keys(vocabularies);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center py-12 px-4 font-sans">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-8 tracking-widest text-center drop-shadow-md uppercase">
        English Adventure 🚀
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full text-center border-4 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-700 mb-8 uppercase">Tria la unitat que vols practicar!</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {llistaUnitats.map((unitat) => (
            <button 
              key={unitat}
              onClick={() => iniciarUnitat(unitat)}
              className="bg-sky-400 hover:bg-sky-500 text-white text-2xl font-extrabold py-6 px-6 rounded-2xl shadow-md transition-transform transform hover:scale-105 uppercase"
            >
              {unitat}
            </button>
          ))}
          
          {/* El botón MIX ya está vivo y conectado */}
          <button 
            onClick={iniciarMix}
            className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-extrabold py-6 px-6 rounded-2xl shadow-md transition-transform transform hover:scale-105 sm:col-span-2 mt-4 border-4 border-purple-300 uppercase"
          >
            ✨ TRIA'N DIVERSES (MIX)
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;