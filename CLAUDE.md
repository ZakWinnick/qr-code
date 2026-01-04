# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QR Code Generator - a Jekyll-based single-page application for generating QR codes. Hosted on GitHub Pages at qr.winnick.cloud.

## Build & Development Commands

```bash
# Install dependencies (if using Bundler)
bundle install

# Local development server
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

## Project Structure

```
/
├── _config.yml          # Jekyll config
├── _layouts/
│   └── default.html     # Base HTML template
├── assets/
│   ├── css/style.css    # Styles
│   └── js/app.js        # QR code generation logic
├── index.html           # Main page
└── CNAME                # Custom domain (qr.winnick.cloud)
```

## Architecture

Simple single-page application:
- `index.html` - UI for QR code generation
- `assets/js/app.js` - JavaScript handling QR code generation
- `assets/css/style.css` - Styling

## Deployment

Automatic via GitHub Pages on push to `main` branch. Custom domain configured via CNAME file.
