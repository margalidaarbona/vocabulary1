import Papa from 'papaparse';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3yI4XLB7bkfrdxvz0_jkxvrOODTgAvaV-3EVJCE6jFrf3_LNUx2KiFaIT9ayTS0MHxS_AhXQjgphQ/pub?output=csv';

export const obtenirVocabulari = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const dades = results.data;
        const unitats = {}; // Cambiamos el nombre de la variable para que sea más claro

        dades.forEach(fila => {
          // Ahora le decimos que mire la columna "unit" de tu Excel
          if (fila.unit && fila.unit.trim() !== '') {
            let nomUnitat = fila.unit.trim().toUpperCase();
            
            // Un pequeño toque: si la unidad es solo un número (1, 2, 3...), le ponemos "UNIT" delante
            if (!isNaN(nomUnitat)) {
              nomUnitat = `UNIT ${nomUnitat}`;
            }
            
            if (!unitats[nomUnitat]) {
              unitats[nomUnitat] = [];
            }
            
            if (fila.english && fila.english.trim() !== '') {
              unitats[nomUnitat].push({
                english: fila.english.trim().toUpperCase(),
                catalan: fila.catalan ? fila.catalan.trim() : '',
                image_url: fila.image_url ? fila.image_url.trim() : '',
              });
            }
          }
        });
        
        resolve(unitats);
      },
      error: (error) => {
        console.error("Error llegint l'Excel:", error);
        reject(error);
      }
    });
  });
};