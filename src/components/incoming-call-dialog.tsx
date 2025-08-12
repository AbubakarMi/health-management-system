
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, PhoneOff, Volume2, Mic, Loader2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificationManager, callManager } from "@/lib/constants";

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

    const handleMissedCall = () => {
        notificationManager.createNotification(
            `You missed a call from ${CALLER_ID}.`,
            '/admin/calls'
        );
        callManager.logCall(CALLER_ID, 'Missed');
        handleDecline();
    };

    useEffect(() => {
        if (isOpen) {
            setCallStatus('ringing');
            setAiResponseAudio(null);
            
            timeoutRef.current = setTimeout(handleMissedCall, TIMEOUT_DURATION);
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
        callManager.logCall(CALLER_ID, 'Answered');
        // AI voice generation is temporarily disabled to resolve a build issue.
        // The call connects, but no automated message will play.
    };
    
    useEffect(() => {
        if (aiResponseAudio && audioRef.current) {
            audioRef.current.play();
        }
    }, [aiResponseAudio]);

    const handleDecline = () => {
        clearCallTimeout();
        if (callStatus === 'ringing') { // Only log as missed if declined while ringing
            callManager.logCall(CALLER_ID, 'Missed');
            notificationManager.createNotification(
                `You missed a call from ${CALLER_ID}.`,
                '/admin/calls'
            );
        }
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
                    <p>Call connected. You may now speak.</p>
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
