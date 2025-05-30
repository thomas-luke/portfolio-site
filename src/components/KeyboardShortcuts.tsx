'use client'

import React, { useState, useEffect } from 'react'

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help with Ctrl+/ or Cmd+/
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setShowHelp(prev => !prev)
      }
      // Close help with Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="help-button"
        title="Keyboard shortcuts (Ctrl+/)"
      >
        ?
      </button>
    )
  }

  return (
    <div className="keyboard-help-overlay" onClick={() => setShowHelp(false)}>
      <div className="keyboard-help" onClick={(e) => e.stopPropagation()}>
        <div className="keyboard-help-header">
          <h3>Keyboard Shortcuts</h3>
          <button onClick={() => setShowHelp(false)} className="help-close">×</button>
        </div>
        <div className="keyboard-help-content">
          <div className="shortcut-group">
            <h4>Search</h4>
            <div className="shortcut-item">
              <kbd>/</kbd>
              <span>Focus search bar</span>
            </div>
            <div className="shortcut-item">
              <kbd>↑</kbd><kbd>↓</kbd>
              <span>Navigate search results</span>
            </div>
            <div className="shortcut-item">
              <kbd>Enter</kbd>
              <span>Open selected note</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close search dropdown</span>
            </div>
          </div>
          <div className="shortcut-group">
            <h4>General</h4>
            <div className="shortcut-item">
              <kbd>Ctrl</kbd><kbd>/</kbd>
              <span>Toggle this help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
