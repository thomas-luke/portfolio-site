import { NoteData, parseNote, parseMarkdown, extractWikiLinks, generateSlug } from './markdownParser'

// This will hold our note cache
let noteCache: Record<string, NoteData> = {}
let noteIndex: Record<string, string> = {} // slug -> filename mapping
let searchIndex: Record<string, string> = {} // For faster searching

// Debounce function for search
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Build note index from available files
export async function buildNoteIndex(): Promise<void> {
  // In a real implementation, this would scan the notes directory
  // For now, we'll manually define our available notes
  noteIndex = {
    'about': 'about.md',
    'what-im-working-on': 'what-im-working-on.md',
    'projects': 'projects.md',
    'technical-details': 'technical-details.md',
    'thoughts': 'thoughts.md',
    'deployment': 'deployment.md'
  }

  // Preload note titles for search
  await preloadNoteTitles()
}

// Preload just the titles and metadata for faster search
async function preloadNoteTitles(): Promise<void> {
  const promises = Object.entries(noteIndex).map(async ([slug, filename]) => {
    try {
      const response = await fetch(`/notes/${filename}`)
      if (response.ok) {
        const content = await response.text()
        const parsed = parseNote(content)
        searchIndex[slug] = `${parsed.data.title || slug} ${(parsed.data.tags || []).join(' ')} ${content.substring(0, 200)}`
      }
    } catch (error) {
      console.warn(`Failed to preload ${slug}:`, error)
    }
  })

  await Promise.all(promises)
}

// Load a note from the public/notes directory
export async function loadNote(slug: string): Promise<NoteData | null> {
  // Check cache first
  if (noteCache[slug]) {
    return noteCache[slug]
  }

  // Ensure index is built
  if (Object.keys(noteIndex).length === 0) {
    await buildNoteIndex()
  }

  const filename = noteIndex[slug]
  if (!filename) {
    console.warn(`Note not found: ${slug}`)
    return null
  }

  try {
    // Load markdown file from public/notes
    const response = await fetch(`/notes/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to load note: ${response.status}`)
    }

    const markdownContent = await response.text()
    const parsed = parseNote(markdownContent)
    
    // Extract wiki links
    const links = extractWikiLinks(parsed.content)
    
    // Parse markdown to HTML
    const htmlContent = await parseMarkdown(parsed.content)
    
    // Create note data
    const noteData: NoteData = {
      slug,
      title: parsed.data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: htmlContent,
      links,
      backlinks: [], // Will be populated when building backlink index
      metadata: {
        date: parsed.data.date,
        tags: parsed.data.tags || [],
        draft: parsed.data.draft || false
      }
    }

    // Cache the note
    noteCache[slug] = noteData
    return noteData

  } catch (error) {
    console.error(`Error loading note ${slug}:`, error)
    return null
  }
}

// Build backlinks for all loaded notes
export function buildBacklinks(): void {
  const allNotes = Object.values(noteCache) as NoteData[]
  
  // Reset backlinks
  allNotes.forEach((note: NoteData) => {
    note.backlinks = []
  })

  // Build backlink relationships
  allNotes.forEach((note: NoteData) => {
    note.links.forEach((linkedSlug: string) => {
      const linkedNote = noteCache[linkedSlug]
      if (linkedNote && linkedNote.backlinks.indexOf(note.slug) === -1) {
        linkedNote.backlinks.push(note.slug)
      }
    })
  })
}

// Get all available note slugs
export function getAvailableNotes(): string[] {
  return Object.keys(noteIndex)
}

// Search notes by content (optimized version)
export function searchNotes(query: string): NoteData[] {
  const lowerQuery = query.toLowerCase()
  
  // Fast search using preloaded search index
  const matchingSlugs = Object.entries(searchIndex)
    .filter(([slug, content]) => content.toLowerCase().includes(lowerQuery))
    .map(([slug]) => slug)

  // Return cached notes or create lightweight note objects for display
  return matchingSlugs.map(slug => {
    if (noteCache[slug]) {
      return noteCache[slug]
    }
    
    // Create a lightweight note object for search results
    return {
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: searchIndex[slug] || '',
      links: [],
      backlinks: [],
      metadata: { tags: [], draft: false }
    } as NoteData
  })
}

// Debounced search function
export const debouncedSearch = debounce((query: string, callback: (results: NoteData[]) => void) => {
  const results = searchNotes(query)
  callback(results)
}, 150)
