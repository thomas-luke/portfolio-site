import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import matter from 'gray-matter'

export interface NoteData {
  slug: string
  title: string
  content: string
  links: string[]
  backlinks: string[]
  metadata: {
    date?: string
    tags?: string[]
    draft?: boolean
  }
}

export interface ParsedNote {
  content: string
  data: {
    title?: string
    date?: string
    tags?: string[]
    draft?: boolean
  }
}

// Parse wiki-style links [[note-id]] or [[note-id:::Display Text]]
export function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
  const links: string[] = []
  let match

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkContent = match[1]
    const [noteId] = linkContent.split(':::')
    if (noteId && !links.includes(noteId)) {
      links.push(noteId.trim())
    }
  }

  return links
}

// Convert wiki links to HTML links
export function processWikiLinks(content: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkContent) => {
    const [noteId, displayText] = linkContent.split(':::')
    const text = displayText ? displayText.trim() : noteId.trim()
    return `<a href="/notes/${noteId.trim()}" class="wiki-link" data-note-id="${noteId.trim()}">${text}</a>`
  })
}

// Parse markdown content
export async function parseMarkdown(content: string): Promise<string> {
  const processedContent = processWikiLinks(content)
  
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedContent)

  return String(file)
}

// Parse note with frontmatter
export function parseNote(content: string): ParsedNote {
  const { data, content: markdownContent } = matter(content)
  
  return {
    content: markdownContent,
    data: {
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      draft: data.draft || false
    }
  }
}

// Generate note slug from filename
export function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
