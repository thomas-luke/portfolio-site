import React from 'react'
import { NoteData } from '@/utils/markdownParser'

interface NoteColumnProps {
  noteId: string
  note?: NoteData | null
  onClose: () => void
  canClose: boolean
  onNoteClick?: (noteId: string) => void
}

export function NoteColumn({ noteId, note, onClose, canClose, onNoteClick }: NoteColumnProps) {
  if (!note) {
    return (
      <div className="note-column">
        <div className="note-content">
          <h1>Note not found</h1>
          <p>The note "{noteId}" could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="note-column">
      <div className="note-content">
        <div 
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
      
      {note.metadata.date && (
        <div className="footer-meta">
          Last updated {note.metadata.date}
        </div>
      )}      {note.backlinks.length > 0 && (
        <div className="backlinks-section">
          <h3 className="backlinks-heading">Links to this note</h3>
          {note.backlinks.map(backlinkId => (
            <div 
              key={backlinkId} 
              className="backlink-item"
              onClick={() => onNoteClick?.(backlinkId)}
            >
              <div className="backlink-title">{backlinkId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              <div className="backlink-preview">
                Click to open this note...
              </div>
            </div>
          ))}
        </div>
      )}

      {canClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: 0.6,
            padding: '4px'
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
