"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Heart, Play, Share2, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTagFilter } from "@/hooks/use-tag-filter"
import SearchBox from "./search-box"
import MusicPlayer from "./music-player"
import AddSongTagDialog from "./add-song-tag-dialog"

// Sample data - in a real app, this would come from an API
const songData = [
  {
    id: 1,
    title: "Summer Memories",
    streamer: "LilyStream",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "3:42",
    views: "245K",
    likes: "18.5K",
    tags: ["pop", "acoustic", "summer"],
  },
  {
    id: 2,
    title: "Midnight Serenade",
    streamer: "MoonlightMelody",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "4:15",
    views: "189K",
    likes: "15.2K",
    tags: ["jazz", "piano", "night"],
  },
  {
    id: 3,
    title: "Electric Dreams",
    streamer: "SynthWave",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "3:58",
    views: "320K",
    likes: "24.7K",
    tags: ["electronic", "synth", "dance"],
  },
  {
    id: 4,
    title: "Mountain Echo",
    streamer: "NatureSounds",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "5:21",
    views: "156K",
    likes: "12.3K",
    tags: ["folk", "acoustic", "nature"],
  },
  {
    id: 5,
    title: "Urban Rhythm",
    streamer: "CityBeats",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "3:35",
    views: "278K",
    likes: "21.9K",
    tags: ["hip-hop", "urban", "beats"],
  },
  {
    id: 6,
    title: "Starlight Sonata",
    streamer: "ClassicalVibes",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "6:12",
    views: "132K",
    likes: "10.8K",
    tags: ["classical", "piano", "night"],
  },
  {
    id: 7,
    title: "Ocean Waves",
    streamer: "SeaSounds",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "4:45",
    views: "198K",
    likes: "16.2K",
    tags: ["ambient", "nature", "relaxing"],
  },
  {
    id: 8,
    title: "Rainy Day Jazz",
    streamer: "MoodMusic",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "5:30",
    views: "210K",
    likes: "19.5K",
    tags: ["jazz", "piano", "relaxing"],
  },
  {
    id: 9,
    title: "Sunset Vibes",
    streamer: "ChillBeats",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "3:25",
    views: "265K",
    likes: "22.1K",
    tags: ["lofi", "chill", "beats"],
  },
  {
    id: 10,
    title: "Morning Coffee",
    streamer: "DailyTunes",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "4:10",
    views: "175K",
    likes: "14.3K",
    tags: ["acoustic", "morning", "relaxing"],
  },
  {
    id: 11,
    title: "City Lights",
    streamer: "NightOwl",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "3:50",
    views: "230K",
    likes: "20.7K",
    tags: ["electronic", "night", "urban"],
  },
  {
    id: 12,
    title: "Forest Meditation",
    streamer: "ZenSounds",
    streamerAvatar: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=350",
    duration: "6:30",
    views: "145K",
    likes: "11.9K",
    tags: ["ambient", "nature", "meditation"],
  },
]

// Type for custom song tags
type CustomSongTags = {
  [songId: number]: string[]
}

export default function SongList() {
  const { selectedTags } = useTagFilter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentSong, setCurrentSong] = useState<(typeof songData)[0] | null>(null)
  const [customSongTags, setCustomSongTags] = useState<CustomSongTags>({})
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [selectedSongForTag, setSelectedSongForTag] = useState<number | null>(null)

  const itemsPerPage = 6

  // Load custom song tags from localStorage on mount
  useEffect(() => {
    const savedCustomSongTags = localStorage.getItem("customSongTags")
    if (savedCustomSongTags) {
      try {
        setCustomSongTags(JSON.parse(savedCustomSongTags))
      } catch (e) {
        console.error("Failed to parse custom song tags from localStorage")
      }
    }
  }, [])

  // Save custom song tags to localStorage when they change
  useEffect(() => {
    localStorage.setItem("customSongTags", JSON.stringify(customSongTags))
  }, [customSongTags])

  // Filter songs based on tags and search term
  const filteredSongs = useMemo(() => {
    return songData.filter((song) => {
      // Get custom tags for this song
      const songCustomTags = customSongTags[song.id] || []

      // Combine default and custom tags
      const allSongTags = [...song.tags, ...songCustomTags]

      // Filter by tags if any are selected
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => allSongTags.includes(tag))

      // Filter by search term if one exists
      const matchesSearch =
        !searchTerm ||
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.streamer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        allSongTags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesTags && matchesSearch
    })
  }, [selectedTags, searchTerm, customSongTags])

  // Calculate pagination
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSongs = filteredSongs.slice(indexOfFirstItem, indexOfLastItem)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Handle page navigation
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  // Handle song play
  const handlePlaySong = (song: (typeof songData)[0]) => {
    setCurrentSong(song)
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Open tag dialog for a song
  const openTagDialog = (songId: number) => {
    setSelectedSongForTag(songId)
    setTagDialogOpen(true)
  }

  // Add a custom tag to a song
  const addCustomTagToSong = (songId: number, tag: string) => {
    setCustomSongTags((prev) => {
      const existingTags = prev[songId] || []
      if (existingTags.includes(tag)) {
        return prev // Tag already exists
      }
      return {
        ...prev,
        [songId]: [...existingTags, tag],
      }
    })
  }

  // Remove a custom tag from a song
  const removeCustomTagFromSong = (songId: number, tag: string) => {
    setCustomSongTags((prev) => {
      const existingTags = prev[songId] || []
      return {
        ...prev,
        [songId]: existingTags.filter((t) => t !== tag),
      }
    })
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Search box */}
      <SearchBox onSearch={handleSearch} />

      {/* Song grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSongs.length > 0 ? (
          currentSongs.map((song) => {
            // Get custom tags for this song
            const songCustomTags = customSongTags[song.id] || []

            return (
              <Card key={song.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative group">
                  <Image
                    src={song.coverImage || "/placeholder.svg"}
                    alt={song.title}
                    width={350}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => handlePlaySong(song)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {song.duration}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={song.streamerAvatar} alt={song.streamer} />
                      <AvatarFallback>{song.streamer[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold line-clamp-1">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">{song.streamer}</p>
                    </div>
                  </div>

                  {/* Default tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {song.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}

                    {/* Custom tags with different styling */}
                    {songCustomTags.map((tag) => (
                      <Badge
                        key={`custom-${tag}`}
                        variant="outline"
                        className="text-xs border-primary/30 bg-primary/5 flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        <button
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCustomTagFromSong(song.id, tag)
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}

                    {/* Add tag button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => openTagDialog(song.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add tag
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">{song.views} views</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    {song.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No songs found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setCurrentPage(1)
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(number)}
                className="w-8 h-8 p-0"
              >
                {number}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-sm text-muted-foreground text-center">
        Showing{" "}
        {filteredSongs.length > 0
          ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredSongs.length)} of `
          : ""}
        {filteredSongs.length} songs
      </div>

      {/* Music Player */}
      <MusicPlayer currentSong={currentSong} />

      {/* Add Tag Dialog */}
      <AddSongTagDialog
        open={tagDialogOpen}
        setOpen={setTagDialogOpen}
        songId={selectedSongForTag}
        onAddTag={addCustomTagToSong}
        existingTags={selectedSongForTag ? customSongTags[selectedSongForTag!] || [] : []}
      />
    </div>
  )
}

