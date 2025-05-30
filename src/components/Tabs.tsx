/// <reference types="@types/react" />
'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TabInterface { // Renamed from Tab to avoid conflict if Tab is a global type
  id: string
  title: string
  noteId: string
  loading?: boolean
}

interface CustomTabControlsProps { // Renamed from TabsProps
  tabs: TabInterface[]
  activeTabId: string
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  maxVisibleTabs?: number
}

export function CustomTabControls({ // Renamed from Tabs
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  maxVisibleTabs = 6 
}: CustomTabControlsProps) {
  const [showOverflow, setShowOverflow] = useState(false)
  const overflowRef = useRef<HTMLDivElement>(null)

  // Close overflow dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
        setShowOverflow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleTabs = tabs.slice(0, maxVisibleTabs - 1)
  const overflowTabs = tabs.slice(maxVisibleTabs - 1)
  const hasOverflow = tabs.length > maxVisibleTabs

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    onTabClose(tabId)
  }

  return (
    <div className="tabs-container">
      {/* Visible tabs */}
      {visibleTabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTabId === tab.id ? 'active' : ''} ${tab.loading ? 'loading' : ''}`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.loading && (
            <svg className="tab-spinner" width="12" height="12" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
                <animate attributeName="stroke-dasharray" dur="1.5s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-16;-32;-32" repeatCount="indefinite"/>
              </circle>
            </svg>
          )}
          <span>{tab.title}</span>
          {tabs.length > 1 && !tab.loading && (
            <span 
              className="tab-close"
              onClick={(e) => handleTabClose(e, tab.id)}
            >
              ×
            </span>
          )}
        </button>
      ))}
      
      {/* Overflow dropdown */}
      {hasOverflow && (
        <div className="tab-overflow" ref={overflowRef}>
          <button
            onClick={() => setShowOverflow(!showOverflow)}
          >
            ...
          </button>
          
          {showOverflow && (
            <div className="overflow-dropdown">
              {overflowTabs.map(tab => (
                <div
                  key={tab.id}
                  className="overflow-dropdown-item"
                >
                  <span 
                    onClick={() => {
                      onTabClick(tab.id)
                      setShowOverflow(false)
                    }}
                    style={{ cursor: 'pointer', flex: 1 }}
                  >
                    {tab.title}
                  </span>
                  <span 
                    className="tab-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTabClose(e, tab.id)
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
