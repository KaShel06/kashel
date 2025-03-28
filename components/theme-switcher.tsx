"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

const themes = [
  { name: "Default", value: "default" },
  { name: "Rose", value: "rose" },
  { name: "Green", value: "green" },
  { name: "Blue", value: "blue" },
  { name: "Purple", value: "purple" },
]

export default function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("default")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if dark mode is enabled
    setIsDarkMode(document.documentElement.classList.contains("dark"))

    // Get current theme from localStorage or default
    const savedTheme = localStorage.getItem("theme-color") || "default"
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme-mode", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme-mode", "light")
    }
  }

  const changeColorTheme = (theme: string) => {
    setCurrentTheme(theme)
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme-color", theme)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={toggleDarkMode}>
        {isDarkMode ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => changeColorTheme(theme.value)}
              className={currentTheme === theme.value ? "bg-accent" : ""}
            >
              {theme.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

