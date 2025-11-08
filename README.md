<p align="center">
<img src="https://github.com/Arejula11/csv-table-view/blob/main/public/assets/logo.png?raw=true" height="150" alt="CSV Table Viewer Icon"/>
</p>

<h1 align="center">CSV Table Viewer</h1>
<p align="center">
  <a href="https://are-dev.es">
    <img src="https://img.shields.io/badge/Website-are--dev.es-blue?style=flat-square" alt="Website">
  </a>
  <a href="https://www.linkedin.com/in/miguel-arejula-aisa-653088291">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin" alt="LinkedIn">
  </a>
  <a href="https://github.com/Arejula11">
    <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github" alt="GitHub">
  </a>
  <a href="https://www.youtube.com/@are-dev">
    <img src="https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=flat-square&logo=youtube" alt="YouTube"></a>
</p>



### **Quickly Transform Raw CSV Data into Interactive, Sortable Tables inside VS Code.**


This extension is designed for data analysts and developers who need to inspect and analyze CSV file content without leaving the editor. It renders large `.csv` files as a highly interactive, responsive HTML table view directly within a VS Code Webview panel.

![Demo of CSV Table Viewer](https://github.com/Arejula11/csv-table-view/blob/main/public/assets/demo.png?raw=true)

## Key Features

* **Interactive Filtering:** Easily filter rows in real-time based on column values using a simple text search bar.

* **Smart Type Sorting:** Sort any column quickly in ascending or descending order, with dedicated logic for three data types:

    * **Numerical Data:** Correctly sorts columns containing integers and decimals.

    * **Text (String) Data:** Standard alphabetical sorting.

    * **Advanced Date Handling:** Correctly identifies and sorts dates in standard **ISO (`YYYY-MM-DD`)** and common **European formats** (e.g., `DD/MM/YYYY`, `DD-MM-YYYY`).

* **Seamless Theme Integration:** The table viewer automatically adapts its colors and styling to **match your current VS Code theme** (light, dark, or high-contrast) for a polished, native look.

* **Delimiter Flexibility:** Automatically detects and handles both **comma (`,`)** and **semicolon (`;`)** delimiters.

* **Quick Access:** Access the viewer immediately via the Command Palette, Editor Title menu, or the Right-Click Context menu.

## How to Use

### 1. Installation

1. Open Visual Studio Code.

2. Go to the Extensions view (`Ctrl+Shift+X`).

3. Search for **CSV Table Viewer**.

4. Click **Install**.

### 2. Opening the Viewer

Once installed, open a `.csv` file in your editor. You can launch the table view in two ways:

#### A. Command Palette

1. Open the Command Palette (`Ctrl+Shift+P`).

2. Type and select: **`CSV Viewer: Open CSV as Table`**.
#### B. Push Notification Button

1. After opening a `.csv` file, look for a pop-up notification at the bottom right corner of the editor.

2. Click the **`Open CSV as Table`** button in the notification to launch the table viewer.

## Development & Contribution

Contributions, bug reports, and feature suggestions are highly welcome!

### Prerequisites

* Node.js (LTS recommended)

* npm or yarn

### Building and Running Locally

1. **Clone the repository:**

  ```bash
   git clone [Your Repository URL]
   cd csv-table-viewer
  ```


2.  **Install dependencies and compile:**

    ```bash
    npm install
    npm run compile
    ```

3.  **Launch the extension:**

      * Press `F5` in VS Code to open a new **Extension Development Host** window.

      * Open a `.csv` file in the new window and run the `Open CSV as Table` command to test your changes.

## License

This project is licensed under the **MIT License**. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

