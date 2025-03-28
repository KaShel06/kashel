import SongList from "@/components/song-list"
import TagFilter from "@/components/tag-filter"
import ThemeSwitcher from "@/components/theme-switcher"
import { TagFilterProvider } from "@/hooks/use-tag-filter"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Streamer Song Collection</h1>
              <p className="text-muted-foreground mt-1">
                Discover and explore songs performed by your favorite streamers
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        <TagFilterProvider>
          <TagFilter />
          <SongList />
        </TagFilterProvider>
      </div>
    </main>
  )
}

