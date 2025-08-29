"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, User, Calendar, FileText, Pill, TestTube, Command, Sparkles, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { detailedPatients, prescriptionManager, labTestManager } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'patient' | 'prescription' | 'lab-test' | 'appointment' | 'record';
  title: string;
  subtitle: string;
  description: string;
  route: string;
  relevance: number;
  tags: string[];
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
}

// AI-powered search algorithm
class AISearch {
  private static fuzzyMatch(query: string, text: string): number {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    if (textLower.includes(queryLower)) {
      return textLower.indexOf(queryLower) === 0 ? 1.0 : 0.8;
    }
    
    // Calculate fuzzy similarity
    let matches = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        matches++;
        queryIndex++;
      }
    }
    
    return matches / queryLower.length * 0.6;
  }

  static searchPatients(query: string): SearchResult[] {
    return detailedPatients.map(patient => {
      let relevance = 0;
      const tags: string[] = [];
      
      // Search in name
      relevance += this.fuzzyMatch(query, patient.name) * 2;
      
      // Search in ID
      relevance += this.fuzzyMatch(query, patient.id);
      
      // Search in condition
      relevance += this.fuzzyMatch(query, patient.condition) * 1.5;
      
      // Search in assigned doctor
      relevance += this.fuzzyMatch(query, patient.assignedDoctor);
      
      // Add relevant tags
      if (patient.condition === 'Critical') tags.push('⚠️ Critical');
      if (patient.admission.isAdmitted) tags.push('🏥 Admitted');
      if (patient.bloodType) tags.push(`🩸 ${patient.bloodType}`);
      
      return {
        id: patient.id,
        type: 'patient' as const,
        title: patient.name,
        subtitle: `ID: ${patient.id} • ${patient.condition}`,
        description: `${patient.assignedDoctor} • Last visit: ${patient.lastVisit}`,
        route: `/admin/patients/${patient.id}`,
        relevance,
        tags,
        icon: User,
        priority: patient.condition === 'Critical' ? 'high' as const : 'medium' as const
      };
    }).filter(result => result.relevance > 0.2);
  }

  static searchPrescriptions(query: string): SearchResult[] {
    const prescriptions = prescriptionManager.getPrescriptions();
    return prescriptions.map(prescription => {
      let relevance = 0;
      const tags: string[] = [];
      
      relevance += this.fuzzyMatch(query, prescription.medicine) * 2;
      relevance += this.fuzzyMatch(query, prescription.patientName);
      relevance += this.fuzzyMatch(query, prescription.doctor);
      relevance += this.fuzzyMatch(query, prescription.status);
      
      if (prescription.status === 'Unavailable') tags.push('❌ Unavailable');
      if (prescription.status === 'Pending') tags.push('⏳ Pending');
      if (prescription.suggestion) tags.push('💡 Has Suggestion');
      
      return {
        id: prescription.id,
        type: 'prescription' as const,
        title: `${prescription.medicine} (${prescription.dosage})`,
        subtitle: `Patient: ${prescription.patientName}`,
        description: `Dr. ${prescription.doctor} • Status: ${prescription.status} • $${prescription.price}`,
        route: `/pharmacist/prescriptions`,
        relevance,
        tags,
        icon: Pill,
        priority: prescription.status === 'Unavailable' ? 'high' as const : 'medium' as const
      };
    }).filter(result => result.relevance > 0.2);
  }

  static searchLabTests(query: string): SearchResult[] {
    const labTests = labTestManager.getLabTests();
    return labTests.map(test => {
      let relevance = 0;
      const tags: string[] = [];
      
      relevance += this.fuzzyMatch(query, test.test) * 2;
      relevance += this.fuzzyMatch(query, test.patient);
      relevance += this.fuzzyMatch(query, test.status);
      
      if (test.status === 'Pending') tags.push('⏳ Pending');
      if (test.status === 'Processing') tags.push('🔄 Processing');
      if (test.status === 'Completed') tags.push('✅ Completed');
      if (!test.invoiced && test.status === 'Completed') tags.push('💰 Billing Needed');
      
      return {
        id: test.id,
        type: 'lab-test' as const,
        title: test.test,
        subtitle: `Patient: ${test.patient}`,
        description: `Collected: ${test.collected} • Status: ${test.status} • $${test.price}`,
        route: `/labtech/tests`,
        relevance,
        tags,
        icon: TestTube,
        priority: test.status === 'Pending' ? 'high' as const : 'medium' as const
      };
    }).filter(result => result.relevance > 0.2);
  }

  static performSearch(query: string): SearchResult[] {
    if (!query.trim()) return [];
    
    const results = [
      ...this.searchPatients(query),
      ...this.searchPrescriptions(query),
      ...this.searchLabTests(query)
    ];
    
    // Sort by relevance and priority
    return results.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.relevance - a.relevance;
    }).slice(0, 12); // Limit to 12 results
  }
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'patients' | 'prescriptions' | 'lab-tests'>('all');
  const router = useRouter();

  // Debounced search
  const performSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const searchResults = AISearch.performSearch(query);
      
      // Filter by search type if not 'all'
      const filteredResults = searchType === 'all' 
        ? searchResults 
        : searchResults.filter(result => result.type === searchType.slice(0, -1));
      
      setResults(filteredResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);
  }, [query, searchType]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? results.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleResultSelect = (result: SearchResult) => {
    router.push(result.route);
    onClose();
    setQuery('');
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      const key = result.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(result);
    });
    return groups;
  }, [results]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return User;
      case 'prescription': return Pill;
      case 'lab-test': return TestTube;
      default: return FileText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search patients, prescriptions, lab tests... (⌘K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg bg-background/50 border-primary/20 focus:border-primary/40"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/20 border-t-primary"></div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {(['all', 'patients', 'prescriptions', 'lab-tests'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    searchType === type
                      ? "bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white shadow-lg"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] px-6 pb-6">
          {!query && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Search</h3>
              <p className="text-muted-foreground">
                Start typing to search across patients, prescriptions, and lab tests
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="secondary">Smart suggestions</Badge>
                <Badge variant="secondary">Fuzzy matching</Badge>
                <Badge variant="secondary">Real-time results</Badge>
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([type, typeResults]) => {
                const TypeIcon = getTypeIcon(type);
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <TypeIcon className="w-4 h-4" />
                      {type === 'lab-test' ? 'Lab Tests' : type.charAt(0).toUpperCase() + type.slice(1)}
                      <Badge variant="outline" className="ml-2">
                        {typeResults.length}
                      </Badge>
                    </div>
                    
                    {typeResults.map((result, index) => {
                      const globalIndex = results.findIndex(r => r.id === result.id);
                      const IconComponent = result.icon;
                      
                      return (
                        <div
                          key={result.id}
                          onClick={() => handleResultSelect(result)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                            globalIndex === selectedIndex
                              ? "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30 shadow-lg"
                              : "bg-card/50 hover:bg-card border-border/50 hover:border-border"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              result.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                              result.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-blue-500/10 text-blue-500'
                            )}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground truncate">
                                  {result.title}
                                </h4>
                                {result.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {result.subtitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {result.description}
                              </p>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {Math.round(result.relevance * 100)}% match
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {results.length > 0 && (
          <div className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between">
            <div>
              Use ↑↓ to navigate, ⏎ to select, ESC to close
            </div>
            <div className="flex items-center gap-4">
              <span>Powered by Nubenta AI</span>
              <Badge variant="outline" className="ml-2">
                {results.length} results
              </Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Global search trigger hook
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
}