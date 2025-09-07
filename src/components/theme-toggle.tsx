"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Check, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function ThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isChanging, setIsChanging] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = React.useCallback((newTheme: string) => {
    setIsChanging(true)
    setTheme(newTheme)
    
    // Smooth animation feedback
    setTimeout(() => {
      setIsChanging(false)
    }, 350)
  }, [setTheme])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="world-class-button">
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse bg-muted rounded" />
      </Button>
    )
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  
  const themeOptions = [
    {
      value: "light",
      label: "Light Mode",
      icon: Sun,
      description: "Clean & bright interface",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      value: "dark", 
      label: "Dark Mode",
      icon: Moon,
      description: "Easy on your eyes",
      gradient: "from-slate-400 to-slate-600",
    },
    {
      value: "system",
      label: "Auto",
      icon: Monitor,
      description: "Matches your device",
      gradient: "from-blue-400 to-purple-500",
    },
  ]

  const getCurrentIcon = () => {
    if (resolvedTheme === "dark") return Moon
    if (resolvedTheme === "light") return Sun
    return Monitor
  }

  const CurrentIcon = getCurrentIcon()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={`
            relative overflow-hidden group transition-all duration-300 ease-out
            hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95
            border-border/60 hover:border-border bg-background/80 backdrop-blur-sm
            ${isChanging ? 'animate-pulse' : ''}
          `}
        >
          <div className="relative z-10 flex items-center justify-center">
            <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all duration-300 ease-out dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100" />
          </div>
          
          {/* Premium animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
          
          {/* Sparkle effect */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-2 w-2 text-primary/60" />
          </div>
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="
          w-64 world-class-card animate-in slide-in-from-top-2 duration-300
          backdrop-blur-2xl bg-card/95 border border-border/50 shadow-2xl
        "
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-semibold text-foreground/80 px-3 py-2">
          <div className="p-1 rounded-full bg-primary/10">
            <Palette className="h-3.5 w-3.5 text-primary" />
          </div>
          Theme Preference
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <div className="p-1">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = theme === option.value
            
            return (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className="
                  flex items-center justify-between p-3 mx-1 my-0.5 cursor-pointer rounded-md
                  transition-all duration-200 ease-out hover:bg-accent/60 focus:bg-accent/60 group
                  data-[highlighted]:bg-accent/60
                "
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-200 ease-out
                    ${isSelected 
                      ? `bg-gradient-to-br ${option.gradient} text-white shadow-lg` 
                      : 'bg-muted/60 group-hover:bg-accent text-muted-foreground group-hover:text-foreground'
                    }
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{option.label}</span>
                      {isSelected && (
                        <Badge 
                          variant="secondary" 
                          className="h-5 px-2 text-xs bg-primary/15 text-primary border-primary/30 font-medium"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {option.description}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center justify-center p-1">
                    <Check className="h-4 w-4 text-primary animate-in zoom-in-75 duration-200" />
                  </div>
                )}
              </DropdownMenuItem>
            )
          })}
        </div>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <div className="p-3 bg-muted/30 mx-1 mb-1 rounded-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Currently using:</span>
            <Badge 
              variant="outline" 
              className={`
                capitalize font-medium border-border/50 text-xs px-2 py-1
                ${resolvedTheme === 'dark' ? 'bg-slate-900/50 text-slate-300' : 'bg-amber-50 text-amber-700'}
              `}
            >
              {resolvedTheme} mode
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
