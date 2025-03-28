"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TagFilterContextType {
  selectedTags: string[]
  toggleTag: (tag: string) => void
  clearTags: () => void
  customTags: string[]
  addCustomTag: (tag: string) => void
  removeCustomTag: (tag: string) => void
}

const TagFilterContext = createContext<TagFilterContextType | undefined>(undefined)

export function TagFilterProvider({ children }: { children: ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTags, setCustomTags] = useState<string[]>([])

  // Load custom tags from localStorage on mount
  useEffect(() => {
    const savedCustomTags = localStorage.getItem("customTags")
    if (savedCustomTags) {
      try {
        setCustomTags(JSON.parse(savedCustomTags))
      } catch (e) {
        console.error("Failed to parse custom tags from localStorage")
      }
    }
  }, [])

  // Save custom tags to localStorage when they change
  useEffect(() => {
    localStorage.setItem("customTags", JSON.stringify(customTags))
  }, [customTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearTags = () => {
    setSelectedTags([])
  }

  const addCustomTag = (tag: string) => {
    if (!customTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag])
      // Automatically select the newly added tag
      setSelectedTags((prev) => [...prev, tag])
    }
  }

  const removeCustomTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag))
    // Also remove from selected tags if it was selected
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <TagFilterContext.Provider
      value={{
        selectedTags,
        toggleTag,
        clearTags,
        customTags,
        addCustomTag,
        removeCustomTag,
      }}
    >
      {children}
    </TagFilterContext.Provider>
  )
}

export function useTagFilter() {
  const context = useContext(TagFilterContext)
  if (context === undefined) {
    throw new Error("useTagFilter must be used within a TagFilterProvider")
  }
  return context
}

