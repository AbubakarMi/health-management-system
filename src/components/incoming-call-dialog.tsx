
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, PhoneOff, Volume2, Mic, Loader2, Bot } from "lucide-react";
import { generateVoiceResponse } from "@/ai/flows/generate-voice-response";
import { useToast } from "@/hooks/use-toast";
import { notificationManager } from "@/lib/constants";

interface IncomingCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CALLER_ID = "+234 706 916 3505";
const TIMEOUT_DURATION = 20000; // 20 seconds

export function IncomingCallDialog({ isOpen, onClose }: IncomingCallDialogProps) {
    const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
    const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
    const [aiResponseAudio, setAiResponseAudio] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setCallStatus('ringing');
            setAiResponseAudio(null);
            
            // Set a timeout to automatically decline the call
            timeoutRef.current = setTimeout(() => {
                handleDecline();
                notificationManager.createNotification(
                    `You missed a call from ${CALLER_ID}.`,
                    '/admin/messages' // A generic link for now
                );
            }, TIMEOUT_DURATION);
        } else {
             if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }

    }, [isOpen]);

    const clearCallTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleAccept = async () => {
        clearCallTimeout();
        setCallStatus('connected');
        setIsGeneratingResponse(true);
        try {
            const response = await generateVoiceResponse({ text: "Hello, you have reached Careflux Hospital's emergency line. An administrator will be with you shortly. Please stay on the line." });
            setAiResponseAudio(response.audioDataUri);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "AI Error", description: "Could not generate voice response."});
        } finally {
            setIsGeneratingResponse(false);
        }
    };
    
    useEffect(() => {
        if (aiResponseAudio && audioRef.current) {
            audioRef.current.play();
        }
    }, [aiResponseAudio]);

    const handleDecline = () => {
        clearCallTimeout();
        setCallStatus('ended');
        onClose();
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-sm">
        <DialogHeader className="text-center items-center">
            {callStatus === 'ringing' && (
                <>
                    <DialogTitle className="text-2xl">Incoming Call</DialogTitle>
                    <DialogDescription className="text-lg">{CALLER_ID}</DialogDescription>
                </>
            )}
             {callStatus === 'connected' && (
                <>
                    <DialogTitle className="text-2xl">Connected</DialogTitle>
                    <DialogDescription className="text-lg">{CALLER_ID}</DialogDescription>
                </>
            )}
        </DialogHeader>
        
        {callStatus === 'ringing' && (
            <div className="flex justify-around py-8">
                <Button variant="destructive" size="lg" className="rounded-full w-20 h-20" onClick={handleDecline}>
                    <PhoneOff className="w-8 h-8"/>
                </Button>
                <Button variant="default" size="lg" className="rounded-full w-20 h-20 bg-green-500 hover:bg-green-600" onClick={handleAccept}>
                    <Phone className="w-8 h-8" />
                </Button>
            </div>
        )}

        {callStatus === 'connected' && (
            <div className="space-y-6 py-4">
                <div className="text-center text-muted-foreground p-4 border rounded-lg bg-muted/50">
                    {isGeneratingResponse ? (
                        <div className="flex items-center justify-center gap-2">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span>AI is generating a response...</span>
                        </div>
                    ) : aiResponseAudio ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                           <Bot className="w-5 h-5" />
                           <span>AI assistant is speaking...</span>
                        </div>
                    ) : (
                        <p>Waiting for response...</p>
                    )}
                </div>
                {aiResponseAudio && <audio ref={audioRef} src={aiResponseAudio} />}
                <div className="flex justify-around text-muted-foreground">
                    <Button variant="ghost" className="flex flex-col h-auto gap-1">
                        <Mic className="w-6 h-6"/>
                        <span className="text-xs">Mute</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-auto gap-1">
                        <Volume2 className="w-6 h-6"/>
                        <span className="text-xs">Speaker</span>
                    </Button>
                </div>
                <Button variant="destructive" size="lg" className="w-full" onClick={handleDecline}>
                    <PhoneOff className="mr-2 w-5 h-5"/>
                    End Call
                </Button>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
