"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Mic,
  X,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Sample lyrics for demonstration
const sampleLyrics = [
  { time: 0, text: "♪ Music starts playing ♪" },
  { time: 5, text: "When the night has come" },
  { time: 10, text: "And the land is dark" },
  { time: 15, text: "And the moon is the only light we'll see" },
  { time: 20, text: "No, I won't be afraid" },
  { time: 25, text: "Oh, I won't be afraid" },
  { time: 30, text: "Just as long as you stand, stand by me" },
  { time: 35, text: "So darling, darling" },
  { time: 40, text: "Stand by me, oh stand by me" },
  { time: 45, text: "Oh stand, stand by me" },
  { time: 50, text: "Stand by me" },
  { time: 55, text: "If the sky that we look upon" },
  { time: 60, text: "Should tumble and fall" },
  { time: 65, text: "Or the mountain should crumble to the sea" },
  { time: 70, text: "I won't cry, I won't cry" },
  { time: 75, text: "No, I won't shed a tear" },
  { time: 80, text: "Just as long as you stand, stand by me" },
]

interface MusicPlayerProps {
  currentSong?: {
    id: number
    title: string
    streamer: string
    coverImage: string
  } | null
}

export default function MusicPlayer({ currentSong }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(90) // seconds
  const [currentTime, setCurrentTime] = useState(0)
  const [progressBarColor, setProgressBarColor] = useState("#9333ea") // Default purple
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Skip to previous song (demo)
  const skipPrevious = () => {
    setCurrentTime(0)
    setProgress(0)
  }

  // Skip to next song (demo)
  const skipNext = () => {
    setCurrentTime(0)
    setProgress(0)
  }

  // Toggle shuffle (demo)
  const toggleShuffle = () => {
    // This would implement actual shuffle functionality in a real app
    console.log("Shuffle toggled")
  }

  // Toggle lock player
  const toggleLock = () => {
    setIsLocked(!isLocked)
  }

  // Toggle player minimize
  const toggleMinimize = () => {
    if (!isLocked) {
      setIsMinimized(!isMinimized)
    }
  }

  // Toggle lyrics display
  const toggleLyrics = () => {
    setShowLyrics(!showLyrics)
  }

  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    setCurrentTime((newProgress / 100) * duration)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Handle color change for progress bar
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgressBarColor(e.target.value)
  }

  // Update progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          const newTime = prev + 0.1
          setProgress((newTime / duration) * 100)
          return newTime
        })
      }, 100)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, duration])

  // Update current lyric based on time
  useEffect(() => {
    for (let i = sampleLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= sampleLyrics[i].time) {
        setCurrentLyricIndex(i)
        break
      }
    }
  }, [currentTime])

  // Scroll to current lyric
  useEffect(() => {
    if (lyricsContainerRef.current && showLyrics) {
      const container = lyricsContainerRef.current
      const activeLyric = container.querySelector(".active-lyric")

      if (activeLyric) {
        activeLyric.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentLyricIndex, showLyrics])

  // If no current song, don't render the player
  if (!currentSong) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t transition-all duration-300 z-50",
        isMinimized && !isLocked ? "h-16" : "h-auto",
        isLocked ? "shadow-lg" : "",
      )}
      style={{ boxShadow: isLocked ? `0 -4px 12px ${progressBarColor}20` : "" }}
    >
      <div className="container mx-auto px-4">
        {/* Minimize/Maximize button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full rounded-t-md rounded-b-none h-6 bg-background border border-b-0"
          onClick={toggleMinimize}
          disabled={isLocked}
        >
          {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Main player controls */}
        <div className="flex items-center justify-between h-16">
          {/* Song info */}
          <div className="flex items-center gap-3 w-1/4">
            <img
              src={currentSong.coverImage || "/placeholder.svg"}
              alt={currentSong.title}
              className="h-10 w-10 rounded-md object-cover"
            />
            <div className="truncate">
              <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentSong.streamer}</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-col items-center justify-center w-2/4">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleShuffle}>
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Shuffle</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={skipPrevious}>
                      <SkipBack className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                className="rounded-full"
                size="icon"
                onClick={togglePlayPause}
                style={{ backgroundColor: progressBarColor }}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={skipNext}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Next</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleLyrics}>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Lyrics</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {!isMinimized && (
              <div className="w-full flex items-center gap-2 mt-1">
                <span className="text-xs">{formatTime(currentTime)}</span>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="flex-1"
                  style={
                    {
                      "--slider-color": progressBarColor,
                    } as React.CSSProperties
                  }
                />
                <span className="text-xs">{formatTime(duration)}</span>
              </div>
            )}
          </div>

          {/* Volume and additional controls */}
          <div className="flex items-center justify-end gap-2 w-1/4">
            {!isMinimized && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : volume < 50 ? (
                    <Volume1 className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                  style={
                    {
                      "--slider-color": progressBarColor,
                    } as React.CSSProperties
                  }
                />
              </div>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleLock}>
                    {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isLocked ? "Unlock player" : "Lock player"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isMinimized && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={progressBarColor}
                        onChange={handleColorChange}
                        className="w-6 h-6 rounded-full overflow-hidden cursor-pointer"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Change player color</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Lyrics panel */}
        {showLyrics && !isMinimized && (
          <div className="border-t pt-2 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Lyrics</h3>
              <Button variant="ghost" size="sm" onClick={toggleLyrics}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div ref={lyricsContainerRef} className="h-32 overflow-y-auto px-4 py-2 bg-muted/30 rounded-md">
              {sampleLyrics.map((lyric, index) => (
                <div
                  key={index}
                  className={cn(
                    "py-1 transition-all",
                    index === currentLyricIndex ? "active-lyric font-medium" : "text-muted-foreground",
                  )}
                  style={{
                    color: index === currentLyricIndex ? progressBarColor : "",
                  }}
                >
                  {lyric.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

