
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { ChatPharmacistDialog } from "@/components/chat-pharmacist-dialog";
import { useToast } from "@/hooks/use-toast";
import { messageManager, users } from "@/lib/constants";

export default function Page() {
    const [isChatDialogOpen, setChatDialogOpen] = useState(false);
    const { toast } = useToast();
    
    const pharmacistUser = users.find(u => u.role === 'pharmacist');

    const handleSendMessage = (message: string) => {
        if (!pharmacistUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not identify the sender.",
            });
            return;
        }

        messageManager.sendMessage({
            from: pharmacistUser.name,
            to: "admin",
            content: message,
        });

        setChatDialogOpen(false);
        toast({
            title: "Request Sent",
            description: "Your request has been sent to the admin.",
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Submit a Request</CardTitle>
                    <CardDescription>Send requests for inventory, supplies, or other administrative needs directly to the admin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-48 border-2 border-dashed rounded-lg">
                        <Button onClick={() => setChatDialogOpen(true)}>
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            Create New Request
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <ChatPharmacistDialog
                isOpen={isChatDialogOpen}
                onClose={() => setChatDialogOpen(false)}
                onSendMessage={handleSendMessage}
            />
        </>
    )
}
