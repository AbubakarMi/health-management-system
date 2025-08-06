
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { detailedPatients, bloodBankInventory, Patient } from "@/lib/constants";
import { Search, Droplet, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BloodBankPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
    const [searchResult, setSearchResult] = useState<{ available: boolean; units: number } | null>(null);

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return detailedPatients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    const handlePatientSelect = (patient: Patient) => {
        setSearchQuery(patient.name);
        setSearchedPatient(patient);
        setSearchResult(null);
    }
    
    const handleSearch = () => {
        if (!searchedPatient) {
            setSearchResult(null);
            return;
        }

        const bloodTypeNeeded = searchedPatient.bloodType;
        const availableBlood = bloodBankInventory.find(b => b.bloodType === bloodTypeNeeded);

        if (availableBlood && availableBlood.quantity > 0) {
            setSearchResult({ available: true, units: availableBlood.quantity });
        } else {
            setSearchResult({ available: false, units: 0 });
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Blood Availability Search</CardTitle>
                    <CardDescription>Search for a patient to check for available blood matches in the inventory.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
                        <div className="relative w-full">
                            <Input 
                                placeholder="Search patient name..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchedPatient(null);
                                    setSearchResult(null);
                                }}
                            />
                            {searchResults.length > 0 && !searchedPatient && (
                                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                                    {searchResults.map(p => (
                                        <div 
                                            key={p.id}
                                            onClick={() => handlePatientSelect(p)}
                                            className="p-2 hover:bg-muted cursor-pointer"
                                        >
                                            {p.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button onClick={handleSearch} disabled={!searchedPatient}>
                            <Search className="mr-2 h-4 w-4" />
                            Check Availability
                        </Button>
                    </div>
                     {searchedPatient && searchResult && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-xl">Search Result</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p><strong>Patient:</strong> {searchedPatient.name}</p>
                                    <p><strong>Blood Type:</strong> {searchedPatient.bloodType}</p>
                                </div>
                                {searchResult.available ? (
                                    <div className="text-green-600 flex items-center gap-2">
                                        <CheckCircle className="h-8 w-8" />
                                        <div>
                                            <p className="font-bold">Available</p>
                                            <p>{searchResult.units} units in stock</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-destructive flex items-center gap-2">
                                        <XCircle className="h-8 w-8" />
                                        <div>
                                            <p className="font-bold">Unavailable</p>
                                            <p>No units in stock</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Droplet /> Blood Bank Inventory</CardTitle>
                    <CardDescription>Current stock levels of all blood types.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Blood Type</TableHead>
                                <TableHead className="text-right">Quantity (Units)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bloodBankInventory.map(item => (
                                <TableRow key={item.bloodType}>
                                    <TableCell className="font-medium">
                                        <Badge variant="secondary">{item.bloodType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
