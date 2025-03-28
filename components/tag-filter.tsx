"use client"

import { useState, type KeyboardEvent } from "react"
import { useTagFilter } from "@/hooks/use-tag-filter"
import { Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Group tags by category
const tagCategories = {
  Genre: ["pop", "rock", "jazz", "classical", "electronic", "hip-hop", "folk", "lofi", "ambient"],
  Instrument: ["acoustic", "piano", "guitar", "vocals", "instrumental", "synth"],
  Mood: [
    "summer",
    "winter",
    "night",
    "nature",
    "urban",
    "dance",
    "beats",
    "relaxing",
    "meditation",
    "chill",
    "morning",
  ],
}

export default function TagFilter() {
  const { selectedTags, toggleTag, clearTags, addCustomTag, customTags, removeCustomTag } = useTagFilter()
  const [activeCategory, setActiveCategory] = useState("Genre")
  const [newTagInput, setNewTagInput] = useState("")

  const handleAddCustomTag = () => {
    if (newTagInput.trim() && !customTags.includes(newTagInput.trim().toLowerCase())) {
      addCustomTag(newTagInput.trim().toLowerCase())
      setNewTagInput("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomTag()
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Filter by Tags</h2>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearTags}>
            Clear filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="Genre" className="mb-4" onValueChange={setActiveCategory}>
        <TabsList>
          {Object.keys(tagCategories).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeCategory === "custom" ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button onClick={handleAddCustomTag} size="sm" disabled={!newTagInput.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {customTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {customTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer group flex items-center gap-1"
                >
                  <span onClick={() => toggleTag(tag)}>{tag}</span>
                  <X
                    className="h-3 w-3 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCustomTag(tag)
                    }}
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No custom tags yet. Add some above!</p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tagCategories[activeCategory as keyof typeof tagCategories].map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

