// Conexión a Supabase
const supabaseUrl = 'https://lqoryfknhwhruhvuzgth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxb3J5ZmtuaHdocnVodnV6Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Nzc3MzAsImV4cCI6MjA3MTQ1MzczMH0.8GW-truzwIV9Ho-1WyDmAJD9XZ9xhjTA_ZN_gKpB2jI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Buscar en la tabla 'matriculas' por nombre de establecimiento
async function buscarMatriculas(nombre) {
  const { data, error } = await supabase
    .from('matriculas')
    .select('*')
    .ilike('ESTABLECIMIENTO', `%${nombre}%`);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

// Escucha el input y muestra resultados
document.getElementById('searchInput').addEventListener('input', async (e) => {
  const nombre = e.target.value;
  const resultados = await buscarMatriculas(nombre);
  mostrarResultados(resultados);
});

// Renderiza los resultados en la tabla
function mostrarResultados(resultados) {
  const tabla = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  tabla.innerHTML = '';
  if (resultados.length === 0) {
    tabla.innerHTML = '<tr><td colspan="2">No hay datos cargados</td></tr>';
    return;
  }
  resultados.forEach(item => {
    tabla.innerHTML += `
      <tr>
        <td>${item["ESTABLECIMIENTO"]}</td>
        <td>
          <button onclick="verDetalle('${item["CUE"]}')">Ver</button>
          <button onclick="exportarPDF('${item["CUE"]}')">Exportar PDF</button>
        </td>
      </tr>
    `;
  });
}


let establecimientos = [];

// Cargar el archivo JSON de establecimientos
fetch('csvjson(2).json')
  .then(response => response.json())
  .then(data => {
    establecimientos = data;
  });

function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";

    // Filtrar por campo 'ESTABLECIMIENTO' (case-insensitive)
    const results = establecimientos.filter(est =>
        est.ESTABLECIMIENTO && est.ESTABLECIMIENTO.toLowerCase().includes(input)
    );

    if(results.length === 0){
        tbody.innerHTML = `<tr><td colspan="2">No se encontraron resultados</td></tr>`;
        return;
    }

    results.forEach(est => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = est.ESTABLECIMIENTO || '(Sin nombre)';
        const actionCell = row.insertCell(1);

        // Botón Ver
        const btnVer = document.createElement('button');
        btnVer.textContent = "Ver";
        btnVer.onclick = () => {
                let nombreCompleto = `${est.DENOMINACION} Nº ${est.NUMERO} \"${est.ESTABLECIMIENTO}\"`;
                let detalle = `${nombreCompleto}\n`;
                detalle += `Fecha: 22/08/2025\n`;
                detalle += `NIVEL: ${est.NIVEL}\nESTRUCTURA: ${est.ESTRUCTURA_CURRICULAR}\nAÑO/GRADO: ${est["GRADO/AÑO"]}\nTURNO: ${est.TURNO}\nSECCION: ${est.SECCION}\nMATRICULA: ${est.MATRICULA}`;
                alert(detalle);
        };
        actionCell.appendChild(btnVer);

        // Botón Exportar PDF
        const btnPDF = document.createElement('button');
        btnPDF.textContent = "Exportar PDF";
        btnPDF.onclick = () => {
            exportarPDF(est);
        };
        actionCell.appendChild(btnPDF);
    });
}

// Exportar PDF con todos los datos
function exportarPDF(est) {
    let nombreCompleto = `${est.DENOMINACION} Nº ${est.NUMERO} \"${est.ESTABLECIMIENTO}\"`;
    let docContent = `${nombreCompleto}\n`;
    docContent += `Fecha: 22/08/2025\n`;
    docContent += `NIVEL: ${est.NIVEL}\nESTRUCTURA: ${est.ESTRUCTURA_CURRICULAR}\nAÑO/GRADO: ${est["GRADO/AÑO"]}\nTURNO: ${est.TURNO}\nSECCION: ${est.SECCION}\nMATRICULA: ${est.MATRICULA}`;
    const blob = new Blob([docContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${est.ESTABLECIMIENTO || 'establecimiento'}.pdf`;
    link.click();
}


// Buscar al escribir (resultados en tiempo real)
document.getElementById('searchInput').addEventListener('input', search);

// Botón Buscar solo fuerza la búsqueda actual, no interfiere con el filtrado instantáneo


// Mejorar búsqueda: solo buscar si hay datos cargados
function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";

    if (!establecimientos || establecimientos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2">No hay datos cargados</td></tr>`;
        return;
    }

    // Filtrar por campo 'ESTABLECIMIENTO' (case-insensitive)
    const results = establecimientos.filter(est =>
        est.ESTABLECIMIENTO && est.ESTABLECIMIENTO.toLowerCase().includes(input)
    );

    if(results.length === 0){
        tbody.innerHTML = `<tr><td colspan="2">No se encontraron resultados</td></tr>`;
        return;
    }

    results.forEach(est => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = est.ESTABLECIMIENTO || '(Sin nombre)';
        const actionCell = row.insertCell(1);

        // Botón Ver
        const btnVer = document.createElement('button');
        btnVer.textContent = "Ver";
        btnVer.onclick = () => {
            let detalle = '';
            for (const key in est) {
                detalle += `${key}: ${est[key]}\n`;
            }
            alert(detalle);
        };
        actionCell.appendChild(btnVer);

        // Botón Exportar PDF
        const btnPDF = document.createElement('button');
        btnPDF.textContent = "Exportar PDF";
        btnPDF.onclick = () => {
            exportarPDF(est);
        };
        actionCell.appendChild(btnPDF);
    });
}