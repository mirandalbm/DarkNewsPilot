import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ui/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Modo Claro"
      case "dark":
        return "Modo Escuro"
      default:
        return "Modo Sistema"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-auto px-3 transition-all duration-200 hover:scale-105"
          data-testid="theme-toggle"
        >
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
          <span className="ml-2 hidden md:inline font-medium">{getLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center cursor-pointer"
          data-testid="theme-light"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Modo Claro</span>
          {theme === "light" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center cursor-pointer"
          data-testid="theme-dark"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Modo Escuro</span>
          {theme === "dark" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center cursor-pointer"
          data-testid="theme-system"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Sistema</span>
          {theme === "system" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}