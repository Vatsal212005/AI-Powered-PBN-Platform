import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function TopBar() {
  const { theme, setTheme } = useTheme();

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

          <div className="relative h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm flex items-center justify-center shadow-md">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
