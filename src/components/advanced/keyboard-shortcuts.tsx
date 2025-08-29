"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Command, 
  Search, 
  Plus, 
  Save, 
  Copy, 
  RefreshCw, 
  Settings, 
  User, 
  Calendar, 
  FileText,
  Keyboard,
  Zap,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShortcutAction {
  id: string;
  category: 'navigation' | 'actions' | 'search' | 'system';
  name: string;
  description: string;
  keys: string[];
  action: () => void;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
}

// Keyboard shortcuts manager
class ShortcutsManager {
  private shortcuts: Map<string, ShortcutAction> = new Map();
  private pressedKeys: Set<string> = new Set();
  private listeners: Set<(shortcut: ShortcutAction) => void> = new Set();

  registerShortcut(shortcut: ShortcutAction) {
    const keyCombo = shortcut.keys.join('+').toLowerCase();
    this.shortcuts.set(keyCombo, shortcut);
  }

  unregisterShortcut(keys: string[]) {
    const keyCombo = keys.join('+').toLowerCase();
    this.shortcuts.delete(keyCombo);
  }

  private normalizeKey(key: string): string {
    const keyMap: Record<string, string> = {
      'Meta': 'cmd',
      'Control': 'ctrl',
      'Alt': 'alt',
      'Shift': 'shift',
      ' ': 'space'
    };
    return keyMap[key] || key.toLowerCase();
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key);
    this.pressedKeys.add(key);

    // Build current key combination
    const currentCombo = Array.from(this.pressedKeys).sort().join('+');
    
    // Check for exact match
    const shortcut = this.shortcuts.get(currentCombo);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
      this.listeners.forEach(listener => listener(shortcut));
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key);
    this.pressedKeys.delete(key);
  };

  getAllShortcuts(): ShortcutAction[] {
    return Array.from(this.shortcuts.values());
  }

  addListener(listener: (shortcut: ShortcutAction) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}

const shortcutsManager = new ShortcutsManager();

// Keyboard shortcuts provider
interface ShortcutsProviderProps {
  children: React.ReactNode;
}

export function ShortcutsProvider({ children }: ShortcutsProviderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    // Register default shortcuts
    const shortcuts: Omit<ShortcutAction, 'action'>[] = [
      // Navigation shortcuts
      {
        id: 'nav-dashboard',
        category: 'navigation',
        name: 'Go to Dashboard',
        description: 'Navigate to the main dashboard',
        keys: ['ctrl', 'd'],
        icon: Command,
        priority: 'high'
      },
      {
        id: 'nav-patients',
        category: 'navigation', 
        name: 'View Patients',
        description: 'Navigate to patients list',
        keys: ['ctrl', 'p'],
        icon: User,
        priority: 'high'
      },
      {
        id: 'nav-calendar',
        category: 'navigation',
        name: 'Open Calendar',
        description: 'Navigate to calendar view',
        keys: ['ctrl', 'c'],
        icon: Calendar,
        priority: 'medium'
      },
      
      // Search shortcuts
      {
        id: 'search-global',
        category: 'search',
        name: 'Global Search',
        description: 'Open global search dialog',
        keys: ['ctrl', 'k'],
        icon: Search,
        priority: 'high'
      },
      {
        id: 'search-patients',
        category: 'search',
        name: 'Search Patients',
        description: 'Quick patient search',
        keys: ['ctrl', 'shift', 'p'],
        icon: User,
        priority: 'medium'
      },
      
      // Action shortcuts
      {
        id: 'action-new',
        category: 'actions',
        name: 'Create New',
        description: 'Create new record',
        keys: ['ctrl', 'n'],
        icon: Plus,
        priority: 'high'
      },
      {
        id: 'action-save',
        category: 'actions',
        name: 'Save',
        description: 'Save current changes',
        keys: ['ctrl', 's'],
        icon: Save,
        priority: 'high'
      },
      {
        id: 'action-refresh',
        category: 'actions',
        name: 'Refresh',
        description: 'Refresh current page',
        keys: ['ctrl', 'r'],
        icon: RefreshCw,
        priority: 'medium'
      },
      {
        id: 'action-copy',
        category: 'actions',
        name: 'Copy',
        description: 'Copy selected content',
        keys: ['ctrl', 'c'],
        icon: Copy,
        priority: 'medium'
      },
      
      // System shortcuts
      {
        id: 'system-help',
        category: 'system',
        name: 'Help & Shortcuts',
        description: 'Show keyboard shortcuts help',
        keys: ['ctrl', 'shift', '?'],
        icon: Keyboard,
        priority: 'high'
      },
      {
        id: 'system-settings',
        category: 'system',
        name: 'Settings',
        description: 'Open system settings',
        keys: ['ctrl', ','],
        icon: Settings,
        priority: 'medium'
      }
    ];

    // Register shortcuts with actions
    shortcuts.forEach(shortcut => {
      const action = (): void => {
        switch (shortcut.id) {
          case 'nav-dashboard':
            router.push('/admin');
            break;
          case 'nav-patients':
            router.push('/admin/patients');
            break;
          case 'nav-calendar':
            router.push('/admin/admissions');
            break;
          case 'search-global':
            // Global search will be handled by its own component
            break;
          case 'action-save':
            toast({
              title: "Save triggered",
              description: "Keyboard shortcut activated",
            });
            break;
          case 'action-refresh':
            window.location.reload();
            break;
          case 'system-help':
            setIsHelpOpen(true);
            break;
          default:
            toast({
              title: shortcut.name,
              description: "Keyboard shortcut activated",
            });
        }
      };

      shortcutsManager.registerShortcut({
        ...shortcut,
        action
      });
    });

    // Initialize shortcuts manager
    shortcutsManager.init();

    return () => {
      shortcutsManager.destroy();
    };
  }, [router, toast]);

  return (
    <>
      {children}
      <ShortcutsHelpDialog 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </>
  );
}

// Shortcuts help dialog
interface ShortcutsHelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShortcutsHelpDialog({ isOpen, onClose }: ShortcutsHelpDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [shortcuts, setShortcuts] = useState<ShortcutAction[]>([]);
  const [recentShortcuts, setRecentShortcuts] = useState<ShortcutAction[]>([]);

  useEffect(() => {
    setShortcuts(shortcutsManager.getAllShortcuts());

    // Listen for shortcut usage
    const unsubscribe = shortcutsManager.addListener((shortcut) => {
      setRecentShortcuts(prev => {
        const filtered = prev.filter(s => s.id !== shortcut.id);
        return [shortcut, ...filtered].slice(0, 5);
      });
    });

    return unsubscribe;
  }, []);

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.keys.join('').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutAction[]>);

  const KeyBadge = ({ keys }: { keys: string[] }) => (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Badge 
            variant="outline" 
            className="px-2 py-1 text-xs font-mono bg-muted/50 border-border/50"
          >
            {key === 'ctrl' ? '⌃' : 
             key === 'cmd' ? '⌘' : 
             key === 'shift' ? '⇧' : 
             key === 'alt' ? '⌥' : 
             key.toUpperCase()}
          </Badge>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const categoryIcons = {
    navigation: Command,
    actions: Zap,
    search: Search,
    system: Settings
  };

  const categoryColors = {
    navigation: 'from-blue-400/10 to-cyan-400/10 text-blue-500',
    actions: 'from-green-400/10 to-emerald-400/10 text-green-500',
    search: 'from-purple-400/10 to-pink-400/10 text-purple-500',
    system: 'from-orange-400/10 to-yellow-400/10 text-orange-500'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Keyboard className="w-6 h-6 text-primary" />
            Keyboard Shortcuts
            <Badge variant="outline" className="ml-2">
              {shortcuts.length} shortcuts
            </Badge>
          </DialogTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by Nubenta</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="px-6 py-2 border-b">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6">
              <TabsContent value="all" className="mt-4 space-y-6">
                {recentShortcuts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Recently Used
                    </h3>
                    <div className="grid gap-2">
                      {recentShortcuts.map(shortcut => (
                        <div key={shortcut.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-gradient-to-br", categoryColors[shortcut.category])}>
                              <shortcut.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{shortcut.name}</div>
                              <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                            </div>
                          </div>
                          <KeyBadge keys={shortcut.keys} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
                  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <div key={category} className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 capitalize">
                        <CategoryIcon className="w-4 h-4" />
                        {category}
                      </h3>
                      <div className="grid gap-2">
                        {categoryShortcuts.map(shortcut => (
                          <div key={shortcut.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-lg bg-gradient-to-br", categoryColors[shortcut.category])}>
                                <shortcut.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{shortcut.name}</div>
                                <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                              </div>
                            </div>
                            <KeyBadge keys={shortcut.keys} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <TabsContent key={category} value={category} className="mt-4 space-y-3">
                  <div className="grid gap-2">
                    {categoryShortcuts.map(shortcut => (
                      <div key={shortcut.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-gradient-to-br", categoryColors[shortcut.category])}>
                            <shortcut.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{shortcut.name}</div>
                            <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                          </div>
                        </div>
                        <KeyBadge keys={shortcut.keys} />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </div>

        <div className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between">
          <div>Press any combination to see available shortcuts</div>
          <div>ESC to close</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using shortcuts in components
export function useKeyboardShortcuts() {
  const [activeShortcuts, setActiveShortcuts] = useState<ShortcutAction[]>([]);

  useEffect(() => {
    setActiveShortcuts(shortcutsManager.getAllShortcuts());
    
    const unsubscribe = shortcutsManager.addListener((shortcut) => {
      // Handle shortcut activation
      console.log('Shortcut activated:', shortcut.name);
    });

    return unsubscribe;
  }, []);

  const registerShortcut = useCallback((shortcut: ShortcutAction) => {
    shortcutsManager.registerShortcut(shortcut);
    setActiveShortcuts(shortcutsManager.getAllShortcuts());
  }, []);

  const unregisterShortcut = useCallback((keys: string[]) => {
    shortcutsManager.unregisterShortcut(keys);
    setActiveShortcuts(shortcutsManager.getAllShortcuts());
  }, []);

  return {
    shortcuts: activeShortcuts,
    registerShortcut,
    unregisterShortcut
  };
}

export { shortcutsManager };