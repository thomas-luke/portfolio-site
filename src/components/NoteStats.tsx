'use client'

import React, { useState, useEffect } from 'react'
import { getAvailableNotes } from '@/utils/noteLoader'

export function NoteStats() {
  const [noteCount, setNoteCount] = useState(0)

  useEffect(() => {
    const notes = getAvailableNotes()
    setNoteCount(notes.length)
  }, [])

  return (
    <div className="note-stats">
      <span className="note-count">{noteCount} notes</span>
    </div>
  )
}
