
"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { detailedPatients, Patient } from "@/lib/constants";
import { Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SelectPatientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPatientSelected: (patient: Patient) => void;
}

export function SelectPatientDialog({ isOpen, onClose, onPatientSelected }: SelectPatientDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const searchResults = useMemo(() => {
        if (!searchQuery) return detailedPatients;
        return detailedPatients.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Select a Patient</DialogTitle>
                    <DialogDescription>Search for and select the patient to create an invoice for.</DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Start typing a patient's name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <ScrollArea className="h-[300px] mt-4 border rounded-md">
                    <div className="p-1">
                        {searchResults.length > 0 ? searchResults.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => onPatientSelected(p)}
                                className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer rounded-md"
                            >
                                <Avatar>
                                  <AvatarImage src={p.avatarUrl} data-ai-hint="person" />
                                  <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {p.id}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No patients found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
