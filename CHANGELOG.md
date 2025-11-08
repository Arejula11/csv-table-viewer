# Change Log

All notable changes to the "csv" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.2] - 2025-11-08
### Fixed
- Corrected `CHANGELOG.md` date of version 1.0.1
- Fixed minor error in `README.md` badges section

## [1.0.1] - 2025-11-08

### Fixed
- CSV notification now appears immediately when opening CSV files
- Fixed issue where notification opened wrong file after switching tabs
- Extension now activates on startup to ensure notifications work correctly

### Changed
- Added social media links to `README.md`
- Improved CSV file detection with proper language association

## [1.0.0] - 2025-11-08

### Added

* **Smart CSV Viewing Interface:** Initial release with a full-featured table view for CSV files
* **Automatic Format Detection:** Intelligent detection of CSV separators (comma and semicolon)
* **CSV Detection Listener:** Added an automatic file type detection that suggests opening the CSV Viewer when a `.csv` file is opened
* **Advanced Sorting Capabilities:**
    * Multi-type column sorting (text, numbers, dates)
    * Support for both ISO (YYYY-MM-DD) and European (DD/MM/YYYY) date formats
    * Dynamic sort direction indicators (A→Z, 0→9) based on column content type
* **Powerful Filtering System:**
    * Column-specific filtering
    * Case-insensitive search
    * Live filter updates

### Changed

* **Webview UI/UX:**
    * Modern, responsive interface with VSCode theme integration
    * Sticky header for better navigation of large datasets
    * Hover effects for better row tracking
    * Compact but readable table layout
* **Filter Interaction:**
    * Added multiple ways to apply filters (button or Enter key)
    * Implemented a reset filter button for quick clear
    * Real-time filter feedback
* **Data Display:**
    * Automatic whitespace trimming for cleaner presentation
    * Row and column count statistics
    * Empty row filtering for cleaner data presentation

### Fixed

* **Data Handling:**
    * Proper handling of empty lines in CSV files
    * Correct processing of whitespace in cell values
    * Robust path handling for both Unix and Windows file systems
* **Date Parsing:**
    * Fixed issues with date recognition and sorting
    * Improved handling of mixed data types within columns

