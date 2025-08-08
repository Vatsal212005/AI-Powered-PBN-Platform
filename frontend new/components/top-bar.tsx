"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopBar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 glass-topbar">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 glass border-white/30 dark:border-white/20 rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">What's New?</span>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-muted-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:text-foreground transition-all duration-300"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg text-muted-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:text-foreground transition-all duration-300"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-card" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@bloggen.ai</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
