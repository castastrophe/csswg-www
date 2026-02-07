# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Built with Eleventy (11ty) v3 using WebC templates.

## Commands

```bash
yarn start          # Development server with hot reload
yarn build          # Production build
yarn ci             # Clean + build (used in CI)
yarn clean          # Remove publish directory
```

## Architecture

### Eleventy Structure
- **Input**: `_content/` - Site content and translations (Markdown)
- **Data**: `_data/` - Global site data
- **Includes**: `_includes/` - Layouts and components
- **Output**: `_site/` - Built site
- **Assets**: `assets/` - Copied resources for publication

### Template System
- Uses **WebC** as the component template engine 
- Global components auto-imported from `_includes/_components/**/*.webc`
- Markdown files processed with markdown-it

### Collections

### CSS Processing
Sass is used for processing.

### Code Style
- Tabs for indentation (tabWidth: 4)
- CSS printWidth: 500

### Environment
- Node 24 (see `.nvmrc`)
- Yarn 4 (corepack)
- `ELEVENTY_ENV=production` enables minification

## Online resources

- Eleventy general documentation: https://www.11ty.dev/
- Eleventy WebC documentation: https://www.11ty.dev/docs/languages/webc/#defining-components