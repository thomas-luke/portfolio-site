---
title: "Technical Details"
date: "2025-05-30"
tags: ["technical", "implementation", "web-dev"]
---

# Technical Details

How this [[about:::portfolio system]] works under the hood.

## Architecture

**Frontend Framework:** Next.js 14 with TypeScript
- Static site generation (`output: 'export'`)
- App Router for modern React patterns
- Client-side navigation for SPA behavior

**Markdown Processing:**
```javascript
// Core libraries
- unified: Universal syntax tree processor
- remark: Markdown processor
- rehype: HTML processor
- gray-matter: Frontmatter parsing
```

**Styling:** CSS modules with custom properties
- Component-scoped styles
- CSS variables for theming
- Responsive design principles

## Key Features

### Wiki-style Linking
Links use the syntax `[[note-id:::Display Text]]` or just `[[note-id]]`.

The [[markdownParser:::markdown parser]] converts these to clickable links that open new columns.

### Multi-column Layout
Inspired by Andy Matuschak's interface:
- Fixed column width (585px)
- Horizontal scrolling
- Dynamic column management

### State Management
- React Context for global state
- Note caching for performance
- Column position tracking

## File Structure
```
public/notes/           # Markdown content
src/components/         # React components
src/utils/             # Utility functions
src/app/               # Next.js app directory
```

## [[deployment:::Deployment Process]]

Static site generation enables hosting on GitHub Pages with zero server costs.

See: [[projects:::Projects overview]] | [[what-im-working-on:::Current work]]
