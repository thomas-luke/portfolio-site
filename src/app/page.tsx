'use client'

import { NoteViewer } from '@/components/NoteViewer'
import { SearchBar } from '@/components/SearchBar'
import { NoteStats } from '@/components/NoteStats'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'

export default function Home() {
  return (
    <main>      <header className="header">
        <h1>Portfolio Notes</h1>
        <NoteStats />
        <SearchBar onNoteSelect={(noteId) => {
          // This will be handled by the NoteViewer component
          const event = new CustomEvent('openNote', { detail: { noteId } })
          window.dispatchEvent(event)
        }} />
        <KeyboardShortcuts />
        <a href="/about" className="note-link">About these notes</a>
      </header>
      <NoteViewer initialNote="about" />
    </main>
  )
}
