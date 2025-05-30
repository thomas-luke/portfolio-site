'use client'

import React, { useState, useEffect } from 'react'
import { NoteColumn } from './NoteColumn'
import { CustomTabControls } from './CustomTabControls'; // Updated import
import { NoteData } from '@/utils/markdownParser'
import { loadNote as loadNoteFromFile, buildBacklinks, buildNoteIndex } from '@/utils/noteLoader'

interface Tab {
  id: string
  title: string
  noteId: string
  loading?: boolean
}

interface NoteViewerProps {
  initialNote?: string
}

export function NoteViewer({ initialNote = 'about' }: NoteViewerProps) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [notes, setNotes] = useState<Record<string, NoteData>>({})
  const [loading, setLoading] = useState(true)

  // Generate unique tab ID
  const generateTabId = () => `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Load a note
  const loadNote = async (noteId: string): Promise<NoteData | null> => {
    if (notes[noteId]) {
      return notes[noteId]
    }

    try {
      const noteData = await loadNoteFromFile(noteId)
      if (noteData) {
        setNotes((prev: Record<string, NoteData>) => {
          const updated = { ...prev, [noteId]: noteData }
          // Rebuild backlinks whenever we add a new note
          setTimeout(() => buildBacklinks(), 0)
          return updated
        })
      }
      return noteData
    } catch (error) {
      console.error('Failed to load note:', noteId, error)
      return null
    }
  }
  // Open note in new tab or switch to existing tab
  const openNote = async (noteId: string) => {
    // Check if note is already open in a tab
    const existingTab = tabs.find(tab => tab.noteId === noteId)
    if (existingTab) {
      setActiveTabId(existingTab.id)
      return
    }

    // Create new tab with loading state
    const newTabId = generateTabId()
    const loadingTab: Tab = {
      id: newTabId,
      title: 'Loading...',
      noteId: noteId,
      loading: true
    }

    setTabs((prev: Tab[]) => [...prev, loadingTab])
    setActiveTabId(newTabId)

    // Load the note data
    const noteData = await loadNote(noteId)
    if (noteData) {
      // Update tab with actual title
      setTabs((prev: Tab[]) => 
        prev.map(tab => 
          tab.id === newTabId 
            ? { ...tab, title: noteData.title, loading: false }
            : tab
        )
      )
    } else {
      // Remove tab if note failed to load
      setTabs((prev: Tab[]) => prev.filter(tab => tab.id !== newTabId))
    }
  }

  // Close tab
  const closeTab = (tabId: string) => {
    setTabs((prev: Tab[]) => {
      const filtered = prev.filter(tab => tab.id !== tabId)
      
      // If we're closing the active tab, switch to another tab
      if (tabId === activeTabId && filtered.length > 0) {
        const tabIndex = prev.findIndex(tab => tab.id === tabId)
        const newActiveIndex = Math.min(tabIndex, filtered.length - 1)
        setActiveTabId(filtered[newActiveIndex].id)
      }
      
      return filtered
    })
  }
  // Handle wiki link clicks
  const handleLinkClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.dataset.noteId) {
      event.preventDefault()
      openNote(target.dataset.noteId)
    }
  }

  // Handle note clicks from search or backlinks
  const handleNoteClick = (noteId: string) => {
    openNote(noteId)
  }

  // Listen for search events
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      openNote(event.detail.noteId)
    }

    window.addEventListener('openNote', handleSearchEvent as EventListener)
    return () => window.removeEventListener('openNote', handleSearchEvent as EventListener)
  }, [])
  // Load initial note
  useEffect(() => {
    const initializeFirstTab = async () => {
      // Build note index first
      await buildNoteIndex()
      
      const noteData = await loadNote(initialNote)
      if (noteData) {
        const firstTab: Tab = {
          id: generateTabId(),
          title: noteData.title,
          noteId: initialNote
        }
        setTabs([firstTab])
        setActiveTabId(firstTab.id)
      }
      setLoading(false)
    }

    initializeFirstTab()
  }, [initialNote])

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }

  const activeTab = tabs.find(tab => tab.id === activeTabId)
  const activeNote = activeTab ? notes[activeTab.noteId] : null

  return (
    <div className="note-container">
      <CustomTabControls // Using renamed component
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={closeTab}
      />
        <div className="note-content-container" onClick={handleLinkClick}>
        {activeNote ? (
          <NoteColumn
            noteId={activeTab!.noteId}
            note={activeNote}
            onClose={() => {}} // Not used in tab mode
            canClose={false} // Closing handled by tabs
            onNoteClick={handleNoteClick}
          />
        ) : (
          <div className="note-column">
            <div className="note-content">
              <h1>No note selected</h1>
              <p>Select a tab to view a note.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
