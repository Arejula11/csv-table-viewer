<p align="center">
  <img src="https://raw.githubusercontent.com/Arejula11/csv-table-view/refs/heads/main/public/assets/logo.png" height="150" alt="CSV Table Viewer Logo"/>
</p>


# CSV Table Viewer for VS Code
Display CSV files as clean, interactive tables inside VS Code.

This extension transforms raw CSV file content into a sortable, easy-to-read HTML table view directly within a VS Code Webview Panel. Perfect for quickly inspecting and understanding large datasets without leaving your editor.

![CSV Table Viewer Screenshot](https://github.com/Arejula11/csv-table-view/blob/main/public/assets/demo.png?raw=true)

## Features

  * **Clean Table View:** Converts your comma (`,`) or semicolon (`;`) delimited CSV data into a well-structured, easy-to-read table.
  * **Automatic Delimiter Detection:** Automatically detects if your file uses commas or semicolons as separators.
  * **Filtering**: Filter rows based on column values using a simple text input.
  * **Interactive Sorting:** Sort any column in **ascending** or **descending** order.
      * **Smart Type Handling:** Correctly sorts columns as **Numbers**, **Text**, or **Dates**.
      * **European Date Support:** Correctly identifies and sorts dates in common European formats (e.g., `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY`), in addition to standard ISO format (`YYYY-MM-DD`).
  * **Quick Access:** Easily open the viewer via the Command Palette, Editor Title Menu, or Right-Click Context Menu.
  * **Theme Integration:** The table view **automatically matches** your current VS Code theme (light, dark, or high-contrast) for a seamless, native look.


## How to Use

### 1. Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for **CSV Table Viewer** (once published, not yet).

### 2. Opening the Viewer

Once the extension is installed, you can open a CSV file as a table in one of three ways:

#### A. Command Palette

1.  Open any `.csv` file in the editor.
2.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3.  Type and select: **`CSV Viewer: Open CSV as Table`**.

#### B. Editor Title Menu (Quick Button) Not Yet Available

1.  Open any `.csv` file.
2.  Click the **"Open CSV as Table"** icon (or similar) located on the right side of the editor tab title bar.

#### C. Context Menu Not Yet Available

1.  Right-click anywhere inside an open `.csv` file.
2.  Select **`Open CSV as Table`** from the menu.


## Development

If you are interested in contributing or building the extension locally:

### Prerequisites

  * Node.js (LTS version recommended)
  * npm

### Building and Running

1.  **Clone the repository:**

    ```bash
    git clone [Your Repository URL]
    cd csv-table-viewer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Compile the extension:**

    ```bash
    npm run compile
    ```

4.  **Launch the extension:**

      * Press `F5` in VS Code to open a new Extension Development Host window.
      * Open a `.csv` file in the new window and run the `Open CSV as Table` command.


## License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.


## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Specific areas for improvement include:

  * Filtering and searching capabilities.
  * More robust column type detection.
  * Header clicks for sorting (currently uses dropdowns).