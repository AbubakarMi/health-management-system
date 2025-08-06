
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Hotel, BedDouble, Trash2 } from "lucide-react";
import { bedManager, Bed, detailedPatients } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Room = {
    roomNumber: string;
    beds: Bed[];
};

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [allBeds, setAllBeds] = useState<Bed[]>([]);
    const [isAddRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
    const [isAddBedDialogOpen, setAddBedDialogOpen] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState("");
    const [newBedNumber, setNewBedNumber] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const { toast } = useToast();

    const updateRoomsAndBeds = () => {
        const beds = bedManager.getBeds();
        setAllBeds([...beds]);
        
        const roomsMap = new Map<string, Room>();
        beds.forEach(bed => {
            if (!roomsMap.has(bed.roomNumber)) {
                roomsMap.set(bed.roomNumber, { roomNumber: bed.roomNumber, beds: [] });
            }
            roomsMap.get(bed.roomNumber)!.beds.push(bed);
        });
        
        const sortedRooms = Array.from(roomsMap.values()).sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
        setRooms(sortedRooms);
    };

    useEffect(() => {
        updateRoomsAndBeds();
        const unsubscribe = bedManager.subscribe(updateRoomsAndBeds);
        return () => unsubscribe();
    }, []);
    
    const handleAddRoom = () => {
        if (!newRoomNumber.trim()) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Room number cannot be empty." });
            return;
        }
        try {
            bedManager.addRoom(newRoomNumber.trim());
            toast({ title: "Room Added", description: `Room ${newRoomNumber} has been successfully created.` });
            setAddRoomDialogOpen(false);
            setNewRoomNumber("");
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };

    const handleAddBed = () => {
        if (!selectedRoom || !newBedNumber.trim()) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Bed number cannot be empty." });
            return;
        }
        try {
            bedManager.addBed(selectedRoom, newBedNumber.trim());
            toast({ title: "Bed Added", description: `Bed ${newBedNumber} added to Room ${selectedRoom}.` });
            setAddBedDialogOpen(false);
            setNewBedNumber("");
            setSelectedRoom(null);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };
    
    const handleDeleteBed = (bed: Bed) => {
        try {
            bedManager.deleteBed(bed.id);
            toast({ title: "Bed Deleted", description: `Bed ${bed.bedNumber} in Room ${bed.roomNumber} has been deleted.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    }
    
    const openAddBedDialog = (roomNumber: string) => {
        setSelectedRoom(roomNumber);
        setNewBedNumber("");
        setAddBedDialogOpen(true);
    }

    return (
        <>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Room & Bed Management</CardTitle>
                            <CardDescription>Add, view, and manage hospital rooms and beds.</CardDescription>
                        </div>
                        <Button onClick={() => setAddRoomDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Room
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {rooms.length > 0 ? (
                        <Accordion type="multiple" className="w-full">
                            {rooms.map((room) => (
                                <AccordionItem key={room.roomNumber} value={room.roomNumber}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-3">
                                            <Hotel className="h-5 w-5" />
                                            <span className="font-semibold text-lg">Room {room.roomNumber}</span>
                                            <span className="text-sm text-muted-foreground">({room.beds.length} beds)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pl-8 pr-4 space-y-3">
                                            {room.beds.map(bed => (
                                                <div key={bed.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <BedDouble className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">Bed {bed.bedNumber}</p>
                                                            <p className="text-xs text-muted-foreground">ID: {bed.id}</p>
                                                        </div>
                                                    </div>
                                                    
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={bed.status === 'Occupied'}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete Bed {bed.bedNumber} from Room {bed.roomNumber}. This action cannot be undone. You can only delete unoccupied beds.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteBed(bed)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            ))}
                                            <Button variant="outline" className="w-full mt-4" onClick={() => openAddBedDialog(room.roomNumber)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Bed to Room {room.roomNumber}
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <p>No rooms found. Start by adding a room.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bed Status Overview</CardTitle>
                    <CardDescription>View the current status of all beds in the hospital.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Bed</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Patient</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allBeds.map(bed => (
                                <TableRow key={bed.id}>
                                    <TableCell>{bed.roomNumber}</TableCell>
                                    <TableCell>{bed.bedNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant={bed.status === 'Available' ? 'default' : 'secondary'} className={bed.status === 'Available' ? 'bg-green-500' : ''}>
                                            {bed.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {bed.patientId ? detailedPatients.find(p => p.id === bed.patientId)?.name : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

            {/* Add Room Dialog */}
            <Dialog open={isAddRoomDialogOpen} onOpenChange={setAddRoomDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Room</DialogTitle>
                        <DialogDescription>Enter the new room number to add it to the hospital.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="room-number">Room Number</Label>
                        <Input id="room-number" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} placeholder="e.g., 305" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setAddRoomDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleAddRoom}>Add Room</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Bed Dialog */}
            <Dialog open={isAddBedDialogOpen} onOpenChange={setAddBedDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Bed to Room {selectedRoom}</DialogTitle>
                        <DialogDescription>Enter the identifier for the new bed.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="bed-number">Bed Identifier</Label>
                        <Input id="bed-number" value={newBedNumber} onChange={(e) => setNewBedNumber(e.target.value)} placeholder="e.g., C" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setAddBedDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleAddBed}>Add Bed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
