import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  // --- Registrar el comando ---
  const disposable = vscode.commands.registerCommand('csv-viewer.openAsTable', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No file is open.');
      return;
    }
    const doc = editor.document;
    if (!doc.fileName.endsWith('.csv')) {
      vscode.window.showErrorMessage('This command only works with CSV files.');
      return;
    }
    showCsvTable(editor.document.uri.fsPath);
  });
  context.subscriptions.push(disposable);

  // --- Listener para sugerir ejecutar la extensión ---
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (!editor) return;
    const doc = editor.document;
    // Solo para CSV
    if (doc.languageId === 'csv' || doc.fileName.endsWith('.csv')) {
      // Mostrar un mensaje de información con acción
      vscode.window.showInformationMessage(
        `CSV file detected: "${doc.fileName.split('/').pop()}"`,
        'Open CSV Viewer'
      ).then(selection => {
        if (selection === 'Open CSV Viewer') {
          vscode.commands.executeCommand('csv-viewer.openAsTable');
        }
      });
    }
  });
}

// --- Función que crea la webview ---
function showCsvTable(filePath: string) {
  const filePathShort = filePath.split('/').pop() || filePath;
  const content = fs.readFileSync(filePath, 'utf8');

  // Detectar separador
  const firstLine = content.split('\n')[0];
  const separator = firstLine.includes(';') ? ';' : ',';
  const rows = content.split('\n').map(r => r.split(separator));

  const panel = vscode.window.createWebviewPanel(
    'csvViewer',
    `${filePathShort} - CSV Viewer`,
    vscode.ViewColumn.Active,
    { enableScripts: true }
  );

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 2rem;
          background-color: var(--vscode-editor-background);
          color: var(--vscode-editor-foreground);
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--vscode-panel-border);
        }
        h2 {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--vscode-foreground);
        }
        .controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        select {
          padding: 0.4rem 0.6rem;
          font-size: 0.9rem;
          background: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          border: 1px solid var(--vscode-input-border);
          border-radius: 2px;
          cursor: pointer;
          outline: none;
        }
        select:hover {
          background: var(--vscode-list-hoverBackground);
        }
        select:focus {
          border-color: var(--vscode-focusBorder);
        }
        .table-wrapper {
          overflow-x: auto;
          border: 1px solid var(--vscode-panel-border);
          border-radius: 2px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          background-color: var(--vscode-editor-background);
        }
        thead {
          background-color: var(--vscode-editor-selectionBackground);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--vscode-panel-border);
          color: var(--vscode-foreground);
        }
        td {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--vscode-panel-border);
        }
        tbody tr {
          transition: background-color 0.15s ease;
        }
        tbody tr:hover {
          background-color: var(--vscode-list-hoverBackground);
        }
        .stats {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: var(--vscode-descriptionForeground);
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${filePathShort}</h2>
          <div class="controls">
            <label for="sortColumn" style="font-size: 0.9rem; margin-right: 0.3rem;">Sort by:</label>
            <select id="sortColumn">
              <option value="">-- None --</option>
              ${rows[0].map((h, i) => `<option value="${i}">${h.trim()}</option>`).join('')}
            </select>
            <select id="sortOrder">
              <option value="asc" data-text="A → Z" data-num="0 → 9">A → Z</option>
              <option value="desc" data-text="Z → A" data-num="9 → 0">Z → A</option>
            </select>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table id="dataTable">
            <thead>
              <tr>${rows[0].map(h => `<th>${h.trim()}</th>`).join('')}</tr>
            </thead>
            <tbody id="tableBody">
              ${rows.slice(1).filter(r => r.some(c => c.trim())).map(r => 
                `<tr>${r.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </div>

        <div class="stats">
          ${rows.slice(1).filter(r => r.some(c => c.trim())).length} rows × ${rows[0].length} columns
        </div>
      </div>

      <script>
        const originalData = ${JSON.stringify(rows.slice(1).filter(r => r.some(c => c.trim())))};
        const sortColumn = document.getElementById('sortColumn');
        const sortOrder = document.getElementById('sortOrder');
        const tableBody = document.getElementById('tableBody');

        // --- Función de ayuda para parsear DD/MM/YYYY o DD-MM-YYYY ---
        function parseEuropeanDate(dateString) {
            // Expresión regular para DD/MM/YYYY o DD-MM-YYYY o DD.MM.YYYY
            const parts = dateString.match(/^(\\d{2})[./-](\\d{2})[./-](\\d{4})$/);
            if (parts) {
                // new Date(Año, Mes-1, Día)
                return new Date(parts[3], parts[2] - 1, parts[1]);
            }
            return null;
        }
        // -------------------------------------------------------------------


        function isNumericColumn(colIndex) {
          // Verificar si la mayoría de valores en la columna son numéricos
          const samples = originalData.slice(0, Math.min(100, originalData.length));
          const numericCount = samples.filter(row => {
            const val = row[colIndex];
            return val && !isNaN(parseFloat(val.trim()));
          }).length;
          
          return numericCount / samples.length > 0.5; // Más del 50% numéricos
        }

        function updateSortOrderLabels() {
          const colIndex = parseInt(sortColumn.value);
          const ascOption = sortOrder.options[0];
          const descOption = sortOrder.options[1];
          
          if (isNaN(colIndex)) {
            ascOption.textContent = 'A → Z';
            descOption.textContent = 'Z → A';
            return;
          }

          if (isNumericColumn(colIndex)) {
            ascOption.textContent = ascOption.getAttribute('data-num');
            descOption.textContent = descOption.getAttribute('data-num');
          } else {
            ascOption.textContent = ascOption.getAttribute('data-text');
            descOption.textContent = descOption.getAttribute('data-text');
          }
        }

        function sortTable() {
          console.log('Sorting table');
          const colIndex = parseInt(sortColumn.value);
          const order = sortOrder.value;

          updateSortOrderLabels();

          if (isNaN(colIndex)) {
            // Sin ordenar - mostrar datos originales
            renderTable(originalData);
            return;
          }

          const sorted = [...originalData].sort((a, b) => {
            const aVal = (a[colIndex] || '').trim();
            const bVal = (b[colIndex] || '').trim();
            
            // --- Lógica de Detección y Comparación de Fechas (Mejorada) ---
            const isoDateRegex = /^\\d{4}-\\d{2}-\\d{2}$/; // YYYY-MM-DD
            
            let aDate = null;
            let bDate = null;
            
            // 1. Intentar formato ISO (YYYY-MM-DD)
            if (isoDateRegex.test(aVal)) {
                aDate = new Date(aVal);
            } else {
                // 2. Intentar formato Europeo (DD/MM/YYYY, etc.)
                aDate = parseEuropeanDate(aVal);
            }

            if (isoDateRegex.test(bVal)) {
                bDate = new Date(bVal);
            } else {
                bDate = parseEuropeanDate(bVal);
            }

            // Si ambas son fechas válidas (no Invalid Date)
            if (aDate && bDate && !isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                const comparison = aDate.getTime() - bDate.getTime();
                return order === 'asc' ? comparison : -comparison;
            }
            // -------------------------------------------------------------------


            // Intentar comparar como números si no son fechas
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return order === 'asc' ? aNum - bNum : bNum - aNum;
            }

            

            // Comparar como strings (por defecto)
            const comparison = aVal.localeCompare(bVal);
            return order === 'asc' ? comparison : -comparison;
          });


          renderTable(sorted);
        }

        function renderTable(data) {
          tableBody.innerHTML = data.map(row => 
            \`<tr>\${row.map(cell => \`<td>\${cell.trim()}</td>\`).join('')}</tr>\`
          ).join('');
        }

        sortColumn.addEventListener('change', sortTable);
        sortOrder.addEventListener('change', sortTable);
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}