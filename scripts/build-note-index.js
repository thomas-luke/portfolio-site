const fs = require('fs')
const path = require('path')

// Build an index of all notes for development
function buildNoteIndex() {
  const notesDir = path.join(__dirname, '../public/notes')
  const files = fs.readdirSync(notesDir).filter(file => file.endsWith('.md'))
  
  const index = {}
  files.forEach(file => {
    const slug = file.replace('.md', '')
    index[slug] = file
  })

  console.log('Available notes:')
  console.log(JSON.stringify(index, null, 2))
  
  // Could write this to a JSON file for build-time optimization
  const indexPath = path.join(__dirname, '../src/data/note-index.json')
  fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  
  console.log(`Note index written to ${indexPath}`)
  
  // Copy .nojekyll file to out directory for GitHub Pages
  const nojekyllSource = path.join(__dirname, '../public/.nojekyll')
  const nojekyllDest = path.join(__dirname, '../out/.nojekyll')
  
  if (fs.existsSync(nojekyllSource)) {
    fs.copyFileSync(nojekyllSource, nojekyllDest)
    console.log('.nojekyll file copied to out directory')
  }
}

if (require.main === module) {
  buildNoteIndex()
}

module.exports = { buildNoteIndex }
