# Portfolio Website

A networked note-taking portfolio website inspired by Andy Matuschak's interface.

## Features

- 📝 Markdown-based content management
- 🔗 Wiki-style linking with `[[note-id]]` syntax
- 📱 Multi-column interface with horizontal scrolling
- 🔄 Bi-directional linking and backlinks
- 📱 Responsive design
- ⚡ Static site generation for GitHub Pages
- 🎨 Clean, minimal design

## Prerequisites

You'll need to install Node.js (version 18 or higher) to run this project.

### Installing Node.js on Windows

1. **Download Node.js:**
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the LTS version (recommended)
   - Run the installer and follow the prompts

2. **Verify installation:**
   Open PowerShell and run:
   ```powershell
   node --version
   npm --version
   ```

## Setup Instructions

1. **Clone and setup the project:**
   ```powershell
   # Navigate to the project directory
   cd C:\Users\lukem\projects\portfolio-site
   
   # Install dependencies
   npm install
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
portfolio-site/
├── public/notes/          # Your markdown content goes here
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── utils/           # Utility functions
├── .github/workflows/   # GitHub Actions for deployment
└── package.json
```

## Adding Content

1. **Create markdown files** in `public/notes/`
2. **Use frontmatter** for metadata:
   ```yaml
   ---
   title: "Note Title"
   date: "2025-05-30"
   tags: ["tag1", "tag2"]
   ---
   ```
3. **Link between notes** using `[[note-filename]]` or `[[note-filename:::Display Text]]`

## Deployment

This project is configured for GitHub Pages deployment:

1. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages"
   - Set source to "GitHub Actions"

3. **The site will automatically deploy** when you push to the main branch

## Customization

- **Styling:** Edit `src/app/globals.css`
- **Colors:** Modify CSS custom properties in the `:root` selector
- **Layout:** Adjust column width and spacing variables
- **Content:** Add/edit markdown files in `public/notes/`

## Development

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Remark/Rehype** - Markdown processing
- **CSS Modules** - Scoped styling
- **GitHub Actions** - Automated deployment

## License

MIT License - feel free to use this as a template for your own portfolio!

## Inspiration

This project is inspired by [Andy Matuschak's working notes](https://notes.andymatuschak.org/) and the concept of networked thought.
