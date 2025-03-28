"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tag, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTagFilter } from "@/hooks/use-tag-filter"

interface AddSongTagDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  songId: number | null
  onAddTag: (songId: number, tag: string) => void
  existingTags: string[]
}

export default function AddSongTagDialog({ open, setOpen, songId, onAddTag, existingTags }: AddSongTagDialogProps) {
  const [newTag, setNewTag] = useState("")
  const { customTags } = useTagFilter()
  const [selectedExistingTag, setSelectedExistingTag] = useState<string | null>(null)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewTag("")
      setSelectedExistingTag(null)
    }
  }, [open])

  const handleAddTag = () => {
    if (!songId) return

    if (selectedExistingTag) {
      onAddTag(songId, selectedExistingTag)
      setSelectedExistingTag(null)
    } else if (newTag.trim()) {
      onAddTag(songId, newTag.trim().toLowerCase())
      setNewTag("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddTag()
    if (!selectedExistingTag && !newTag.trim()) {
      setOpen(false)
    }
  }

  // Filter out tags that are already applied to this song
  const availableCustomTags = customTags.filter((tag) => !existingTags.includes(tag))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add Custom Tag to Song
          </DialogTitle>
          <DialogDescription>Add your own tags to organize and filter songs your way.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Existing custom tags */}
            {availableCustomTags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Your existing tags:</label>
                <div className="flex flex-wrap gap-2">
                  {availableCustomTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedExistingTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedExistingTag(tag === selectedExistingTag ? null : tag)
                        setNewTag("")
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {availableCustomTags.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or create new tag</span>
                </div>
              </div>
            )}

            {/* Create new tag */}
            <div className="space-y-2">
              {!availableCustomTags.length && <label className="text-sm font-medium">Create a new tag:</label>}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new tag..."
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value)
                    setSelectedExistingTag(null)
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={
                    (!newTag.trim() && !selectedExistingTag) ||
                    (!!newTag.trim() && existingTags.includes(newTag.trim().toLowerCase()))
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Currently applied tags */}
            {existingTags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Currently applied custom tags:</label>
                <div className="flex flex-wrap gap-2">
                  {existingTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

