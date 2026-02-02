# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

QR Code Generator - Jekyll-based single-page app for generating QR codes with optional logo overlay. Live at https://qr.winnick.cloud. Supports URLs, plain text, and vCard contacts.

## Development Commands

```bash
# Install dependencies
bundle install

# Local development
bundle exec jekyll serve
# Runs at http://localhost:4000

# Build for production
bundle exec jekyll build
```

Deployment: Automatic via GitHub Pages on push to `main`.

## Project Structure

```
/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   └── default.html         # HTML template (includes QRious CDN)
├── assets/
│   ├── css/style.css        # All styling
│   └── js/app.js            # QR generation logic
├── index.html               # Main application UI
├── CNAME                    # Custom domain (qr.winnick.cloud)
└── Gemfile                  # github-pages gem
```

## Architecture

Client-side SPA with three main components:

1. **`index.html`** - Tab-based UI for input modes (URL, Text, Contact)
2. **`assets/js/app.js`** - Application state and QR generation
3. **`assets/css/style.css`** - Responsive dark theme styling

### QR Library

Uses [QRious](https://github.com/neocotic/qrious) (loaded via CDN in `default.html`):
```javascript
new QRious({
  element: canvas,
  value: data,
  size: 300,
  background: 'white',
  foreground: 'black',
  level: 'H'  // High error correction for logo overlay
});
```

## Application State

```javascript
const state = {
  activeTab: 'url',      // Current input mode
  qrData: '',            // Encoded data string
  logo: null,            // Base64 logo image
  logoSize: 25           // Logo size as % of QR code
};
```

## Input Modes

### URL Tab
- Auto-prepends `https://` if no protocol
- Input: `urlInput`

### Text Tab
- Plain text encoding
- Input: `textInput`

### Contact Tab (vCard 3.0)
Generates vCard format:
```
BEGIN:VCARD
VERSION:3.0
FN:First Last
N:Last;First;;;
ORG:Organization
TEL:phone
EMAIL:email
URL:url
END:VCARD
```

Inputs: `firstName`, `lastName`, `phone`, `email`, `organization`, `contactUrl`

## Logo Overlay

1. Upload via click or drag-and-drop (max 5MB)
2. Adjustable size slider (10-50% of QR code)
3. White rounded-rect padding around logo
4. High error correction (`level: 'H'`) ensures scannability

## User Actions

| Button | Function |
|--------|----------|
| Download | Exports canvas as PNG (`qr-code-{tab}.png`) |
| Copy Data | Copies encoded data to clipboard |
| Clear | Resets all inputs and state |
| Remove Logo | Clears uploaded logo |

## Key Functions

### `generateQR()`
Main rendering function called on any input change:
1. Builds data string based on active tab
2. Updates state and UI visibility
3. Renders QR code to canvas
4. Overlays logo if present

### `handleFile(file)`
Logo upload handler:
1. Validates size (< 5MB)
2. Reads as base64 DataURL
3. Updates preview UI
4. Triggers re-render

## DOM Element IDs

| ID | Element |
|----|---------|
| `qrCanvas` | 300x300 canvas for QR code |
| `qrPlaceholder` | "Enter data" placeholder |
| `qrDisplay` | Container for generated QR |
| `uploadArea` | Drag-and-drop zone |
| `fileInput` | Hidden file input |
| `logoPreview` | Uploaded logo preview |
| `logoSize` | Size slider (10-50) |
| `dataPreview` | Shows encoded data string |
| `btnGroup` | Download/Copy buttons |

## Styling

`assets/css/style.css`:
- Dark theme with gradient backgrounds
- Tab-based navigation
- Responsive layout
- Drag-and-drop visual feedback
- Button hover states

## Deployment

GitHub Pages serves static files. Custom domain via CNAME. No server-side processing - all QR generation happens in browser.
