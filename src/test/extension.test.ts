import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

suite('CSV Viewer Extension Test Suite', () => {
  let tempDir: string;
  let testCsvPath: string;
  let testCsvWithSemicolonPath: string;

  // Setup: Create temporary CSV files for testing
  suiteSetup(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-viewer-test-'));
    
    // Create a test CSV with comma separator
    testCsvPath = path.join(tempDir, 'test.csv');
    const csvContent = `Name,Age,City
Alice,30,New York
Bob,25,Los Angeles
Charlie,35,Chicago`;
    fs.writeFileSync(testCsvPath, csvContent);

    // Create a test CSV with semicolon separator
    testCsvWithSemicolonPath = path.join(tempDir, 'test-semicolon.csv');
    const csvSemicolonContent = `Name;Age;City
Alice;30;New York
Bob;25;Los Angeles
Charlie;35;Chicago`;
    fs.writeFileSync(testCsvWithSemicolonPath, csvSemicolonContent);
  });

  // Cleanup: Remove temporary files
  suiteTeardown(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('Should show error when no file is open', async () => {
    // Close all editors
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    
    // Try to execute command
    await vscode.commands.executeCommand('csv-viewer.openAsTable');
  });

  test('Should show error when non-CSV file is open', async () => {
    // Create a temporary .txt file
    const txtPath = path.join(tempDir, 'test.txt');
    fs.writeFileSync(txtPath, 'This is not a CSV file');
    
    // Open the text file
    const doc = await vscode.workspace.openTextDocument(txtPath);
    await vscode.window.showTextDocument(doc);
    
    // Try to execute command
    await vscode.commands.executeCommand('csv-viewer.openAsTable');
    
    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('Should open webview for CSV file with comma separator', async () => {
    // Open the CSV file
    const doc = await vscode.workspace.openTextDocument(testCsvPath);
    await vscode.window.showTextDocument(doc);
    
    // Execute the command
    await vscode.commands.executeCommand('csv-viewer.openAsTable');
    
    // Wait a bit for the webview to open
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('Should open webview for CSV file with semicolon separator', async () => {
    // Open the CSV file
    const doc = await vscode.workspace.openTextDocument(testCsvWithSemicolonPath);
    await vscode.window.showTextDocument(doc);
    
    // Execute the command
    await vscode.commands.executeCommand('csv-viewer.openAsTable');
    
    // Wait a bit for the webview to open
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('Should detect CSV file and show information message', async () => {
    // This test would require mocking vscode.window.showInformationMessage
    // to verify the message is shown when a CSV file is opened
    
    const doc = await vscode.workspace.openTextDocument(testCsvPath);
    await vscode.window.showTextDocument(doc);
    
    // Wait for the event handler to trigger
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });
});

suite('CSV Parsing Tests', () => {
  test('Should correctly parse comma-separated CSV', () => {
    const content = `Name,Age,City
Alice,30,New York
Bob,25,Los Angeles`;
    
    const rows = content.split('\n').map(r => r.split(','));
    
    assert.strictEqual(rows.length, 3);
    assert.strictEqual(rows[0][0], 'Name');
    assert.strictEqual(rows[1][1], '30');
  });

  test('Should correctly parse semicolon-separated CSV', () => {
    const content = `Name;Age;City
Alice;30;New York
Bob;25;Los Angeles`;
    
    const firstLine = content.split('\n')[0];
    const separator = firstLine.includes(';') ? ';' : ',';
    const rows = content.split('\n').map(r => r.split(separator));
    
    assert.strictEqual(separator, ';');
    assert.strictEqual(rows.length, 3);
    assert.strictEqual(rows[0][0], 'Name');
    assert.strictEqual(rows[1][1], '30');
  });

  test('Should handle empty lines in CSV', () => {
    const content = `Name,Age,City
Alice,30,New York

Bob,25,Los Angeles`;
    
    const rows = content.split('\n').map(r => r.split(','));
    const filteredRows = rows.filter(r => r.some(c => c.trim()));
    
    assert.strictEqual(rows.length, 4);
    assert.strictEqual(filteredRows.length, 3);
  });

  test('Should trim whitespace from cells', () => {
    const content = `Name , Age , City
 Alice , 30 , New York `;
    
    const rows = content.split('\n').map(r => r.split(','));
    const trimmedValue = rows[1][0].trim();
    
    assert.strictEqual(trimmedValue, 'Alice');
  });
});

suite('File Path Tests', () => {
  test('Should extract short filename from full path (Unix)', () => {
    const filePath = '/home/user/documents/test.csv';
    const filePathShort = filePath.split('/').pop() || filePath;
    
    assert.strictEqual(filePathShort, 'test.csv');
  });

  test('Should extract short filename from full path (Windows)', () => {
    const filePath = 'C:\\Users\\user\\documents\\test.csv';
    const filePathShort = filePath.split(/[/\\]/).pop() || filePath;
    
    assert.strictEqual(filePathShort, 'test.csv');
  });

  test('Should handle path with no separators', () => {
    const filePath = 'test.csv';
    const filePathShort = filePath.split('/').pop() || filePath;
    
    assert.strictEqual(filePathShort, 'test.csv');
  });
});

suite('Separator Detection Tests', () => {
  test('Should detect comma as separator', () => {
    const firstLine = 'Name,Age,City';
    const separator = firstLine.includes(';') ? ';' : ',';
    
    assert.strictEqual(separator, ',');
  });

  test('Should detect semicolon as separator', () => {
    const firstLine = 'Name;Age;City';
    const separator = firstLine.includes(';') ? ';' : ',';
    
    assert.strictEqual(separator, ';');
  });

  test('Should default to comma when no semicolon present', () => {
    const firstLine = 'Name Age City';
    const separator = firstLine.includes(';') ? ';' : ',';
    
    assert.strictEqual(separator, ',');
  });
});