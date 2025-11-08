"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
function activate(context) {
  const disposable = vscode.commands.registerCommand("csv-viewer.openAsTable", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No file is open.");
      return;
    }
    const doc = editor.document;
    if (!doc.fileName.endsWith(".csv")) {
      vscode.window.showErrorMessage("This command only works with CSV files.");
      return;
    }
    showCsvTable(editor.document.uri.fsPath);
  });
  context.subscriptions.push(disposable);
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) return;
    const doc = editor.document;
    if (doc.languageId === "csv" || doc.fileName.endsWith(".csv")) {
      vscode.window.showInformationMessage(
        `CSV file detected: "${doc.fileName.split("/").pop()}"`,
        "Open CSV Viewer"
      ).then((selection) => {
        if (selection === "Open CSV Viewer") {
          vscode.commands.executeCommand("csv-viewer.openAsTable");
        }
      });
    }
  });
}
function showCsvTable(filePath) {
  const filePathShort = filePath.split("/").pop() || filePath;
  const content = fs.readFileSync(filePath, "utf8");
  const firstLine = content.split("\n")[0];
  const separator = firstLine.includes(";") ? ";" : ",";
  const rows = content.split("\n").map((r) => r.split(separator));
  const panel = vscode.window.createWebviewPanel(
    "csvViewer",
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
            <label for="filterColumn" style="font-size: 0.9rem; margin-right: 0.3rem;">Filter by:</label>
            <select id="filterColumn">
              <option value="">-- None --</option>
              ${rows[0].map((h, i) => `<option value="${i}">${h.trim()}</option>`).join("")}
            </select>
            <label for="filterValue" style="font-size: 0.9rem; margin-left: 0.5rem; margin-right: 0.3rem;">Value:</label>
            <input type="text" id="filterValue" style="font-size: 0.9rem; padding: 0.4rem; border: 1px solid var(--vscode-input-border); border-radius: 2px;">
            <button id="applyFilter" style="font-size: 0.9rem; padding: 0.4rem 0.6rem; border: 1px solid var(--vscode-input-border); border-radius: 2px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer;">Apply</button>
            <button id="resetFilter" style="font-size: 0.9rem; padding: 0.4rem 0.6rem; border: 1px solid var(--vscode-input-border); border-radius: 2px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer;">Reset</button>



            <label for="sortColumn" style="font-size: 0.9rem; margin-right: 0.3rem;">Sort by:</label>
            <select id="sortColumn">
              <option value="">-- None --</option>
              ${rows[0].map((h, i) => `<option value="${i}">${h.trim()}</option>`).join("")}
            </select>
            <select id="sortOrder">
              <option value="asc" data-text="A \u2192 Z" data-num="0 \u2192 9">A \u2192 Z</option>
              <option value="desc" data-text="Z \u2192 A" data-num="9 \u2192 0">Z \u2192 A</option>
            </select>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table id="dataTable">
            <thead>
              <tr>${rows[0].map((h) => `<th>${h.trim()}</th>`).join("")}</tr>
            </thead>
            <tbody id="tableBody">
              ${rows.slice(1).filter((r) => r.some((c) => c.trim())).map(
    (r) => `<tr>${r.map((c) => `<td>${c.trim()}</td>`).join("")}</tr>`
  ).join("")}
            </tbody>
          </table>
        </div>

        <div class="stats">
          ${rows.slice(1).filter((r) => r.some((c) => c.trim())).length} rows \xD7 ${rows[0].length} columns
        </div>
      </div>

      <script>
        // 1. Datos Originales Inmutables
        const originalData = ${JSON.stringify(rows.slice(1).filter((r) => r.some((c) => c.trim())))};
        
        // 2. Elementos DOM
        const sortColumn = document.getElementById('sortColumn');
        const sortOrder = document.getElementById('sortOrder');
        const filterColumn = document.getElementById('filterColumn');
        const filterValue = document.getElementById('filterValue');
        const applyFilterBtn = document.getElementById('applyFilter');
        const resetFilterBtn = document.getElementById('resetFilter');
        const tableBody = document.getElementById('tableBody');

        // 3. Estado de la Aplicaci\xF3n (El filtro se aplica al original, la ordenaci\xF3n al resultado)
        let currentFilteredData = [...originalData];


        // --- Helper para parsear DD/MM/YYYY o DD-MM-YYYY ---
        function parseEuropeanDate(dateString) {
            const parts = dateString.match(/^(\\d{2})[./-](\\d{2})[./-](\\d{4})$/);
            if (parts) {
                return new Date(parts[3], parts[2] - 1, parts[1]);
            }
            return null;
        }


        function isNumericColumn(colIndex) {
          const samples = originalData.slice(0, Math.min(100, originalData.length));
          const numericCount = samples.filter(row => {
            const val = row[colIndex];
            return val && !isNaN(parseFloat(val.trim()));
          }).length;
          
          return numericCount / samples.length > 0.5;
        }

        function updateSortOrderLabels() {
          const colIndex = parseInt(sortColumn.value);
          const ascOption = sortOrder.options[0];
          const descOption = sortOrder.options[1];
          
          if (isNaN(colIndex)) {
            ascOption.textContent = 'A \u2192 Z';
            descOption.textContent = 'Z \u2192 A';
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
        
        // -------------------------------------------------------------------
        // --- FUNCI\xD3N CENTRAL: Aplica FILTRO y luego ORDENACI\xD3N ---
        // -------------------------------------------------------------------

        function applyFilter() {
          const colIndex = parseInt(filterColumn.value);
          const value = filterValue.value.trim().toLowerCase();
          
          if (isNaN(colIndex) || !value) {
            // Si no hay filtro, usar datos originales
            currentFilteredData = [...originalData];
          } else {
            // Si hay filtro, filtrar los datos originales
            currentFilteredData = originalData.filter(row => {
              const cell = (row[colIndex] || '').trim().toLowerCase();
              return cell.includes(value);
            });
          }
          // Llama a la funci\xF3n principal para que aplique la ordenaci\xF3n
          updateTable();
        }

        function resetFilter() {
          filterColumn.value = '';
          filterValue.value = '';
          applyFilter(); // Vuelve a aplicar (esto resetear\xE1 currentFilteredData a originalData)
        }


        function updateTable() {
          console.log('Updating table: Applying sort to filtered data.');
          const colIndex = parseInt(sortColumn.value);
          const order = sortOrder.value;

          updateSortOrderLabels();
          
          // La ordenaci\xF3n se realiza SIEMPRE sobre currentFilteredData
          let dataToRender = [...currentFilteredData];
          
          if (isNaN(colIndex)) {
            // No hay columna de ordenaci\xF3n seleccionada, renderizar currentFilteredData como est\xE1
            render(dataToRender);
            return;
          }

          // Aplicar l\xF3gica de ordenaci\xF3n
          const sorted = dataToRender.sort((a, b) => {
            const aVal = (a[colIndex] || '').trim();
            const bVal = (b[colIndex] || '').trim();
            
            // L\xF3gica de Fechas
            const isoDateRegex = /^\\d{4}-\\d{2}-\\d{2}$/; // YYYY-MM-DD
            let aDate = isoDateRegex.test(aVal) ? new Date(aVal) : parseEuropeanDate(aVal);
            let bDate = isoDateRegex.test(bVal) ? new Date(bVal) : parseEuropeanDate(bVal);

            if (aDate && bDate && !isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                const comparison = aDate.getTime() - bDate.getTime();
                return order === 'asc' ? comparison : -comparison;
            }

            // L\xF3gica de N\xFAmeros
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return order === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // L\xF3gica de Strings (por defecto)
            const comparison = aVal.localeCompare(bVal);
            return order === 'asc' ? comparison : -comparison;
          });


          render(sorted);
        }

        function render(data) {
          tableBody.innerHTML = data.map(row => 
            \`<tr>\${row.map(cell => \`<td>\${cell.trim()}</td>\`).join('')}</tr>\`
          ).join('');
        }
        
        // -------------------------------------------------------------------
        // --- LISTENERS ---
        // -------------------------------------------------------------------

        sortColumn.addEventListener('change', updateTable);
        sortOrder.addEventListener('change', updateTable);
        applyFilterBtn.addEventListener('click', applyFilter);
        resetFilterBtn.addEventListener('click', resetFilter);
        
        // Permite aplicar el filtro al presionar Enter en el campo de valor
        filterValue.addEventListener('keyup', (event) => {
             if (event.key === 'Enter') {
                 applyFilter();
             }
        });

        // Renderizar tabla inicial (sin filtro y sin ordenar)
        updateTable();
        
      </script>
    </body>
    </html>
  `;
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
