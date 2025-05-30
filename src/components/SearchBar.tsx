'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NoteData } from '@/utils/markdownParser'
import { searchNotes, getAvailableNotes, debouncedSearch } from '@/utils/noteLoader'

interface SearchBarProps {
  onNoteSelect: (noteId: string) => void
}

export function SearchBar({ onNoteSelect }: SearchBarProps) {  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NoteData[]>([])
  const [allNotes, setAllNotes] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search callback
  const handleSearchResults = useCallback((results: NoteData[]) => {
    setResults(results)
    setIsSearching(false)
    setShowDropdown(true)
    setFocusedIndex(-1)
  }, [])

  // Load available notes on mount
  useEffect(() => {
    setAllNotes(getAvailableNotes())
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true)
      debouncedSearch(query, handleSearchResults)
    } else {
      setResults([])
      setShowDropdown(false)
      setFocusedIndex(-1)
      setIsSearching(false)
    }
  }, [query, handleSearchResults])

  // Handle global keyboard shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Check if we're not in an input field
        const activeElement = document.activeElement
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          inputRef.current?.focus()
          setShowDropdown(true)
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => prev <= 0 ? results.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && results[focusedIndex]) {
          handleNoteSelect(results[focusedIndex].slug)
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setFocusedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleNoteSelect = (noteId: string) => {
    onNoteSelect(noteId)
    setQuery('')
    setShowDropdown(false)
    setFocusedIndex(-1)
    inputRef.current?.blur()
  }

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowDropdown(true)
    }
  }

  // Show quick access to all notes when input is focused but empty
  const displayResults = query.trim() 
    ? results 
    : allNotes.slice(0, 6).map(slug => ({ 
        slug, 
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        content: '',
        links: [],
        backlinks: [],
        metadata: { tags: [], draft: false }
      } as NoteData))

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-container">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>        <input
          ref={inputRef}
          type="text"
          placeholder="Search notes... (or press / to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {isSearching && (
          <div className="search-loading">
            <svg className="search-spinner" width="16" height="16" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
                <animate attributeName="stroke-dasharray" dur="1.5s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-16;-32;-32" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        )}
        {query && !isSearching && (
          <button
            onClick={() => {
              setQuery('')
              setShowDropdown(false)
            }}
            className="search-clear"
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="search-dropdown">
          {displayResults.length > 0 ? (
            <>
              {!query.trim() && (
                <div className="search-dropdown-header">Quick Access</div>
              )}
              {displayResults.map((note, index) => (
                <div
                  key={note.slug}
                  className={`search-result-item ${index === focusedIndex ? 'focused' : ''}`}
                  onClick={() => handleNoteSelect(note.slug)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="search-result-title">{note.title}</div>
                  {query.trim() && note.content && (
                    <div className="search-result-preview">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : query.trim() ? (
            <div className="search-no-results">
              No notes found for "{query}"
            </div>
          ) : (
            <div className="search-no-results">
              Start typing to search notes...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
