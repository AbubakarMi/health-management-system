
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { messageManager, Message, users, Role } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Send, MessageSquare, Edit } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { NewMessageDialog } from '@/components/new-message-dialog';
import { useToast } from '@/hooks/use-toast';

type Conversation = {
    participant: string;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
};

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isNewMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Effect for handling message updates from the manager
    useEffect(() => {
        const handleUpdate = () => {
            const convos = messageManager.getConversations('admin');
            setConversations(convos);

            // If a conversation is selected, find its updated version
            if (selectedConversation) {
                 const updatedSelected = convos.find(c => c.participant === selectedConversation.participant);
                 setSelectedConversation(updatedSelected || null);
            }
        };

        handleUpdate(); // Initial load
        const unsubscribe = messageManager.subscribe(handleUpdate);
        return () => unsubscribe();
    }, []); // Removed selectedConversation from dependencies to break the loop

    // Effect for auto-selecting the first conversation on initial load
    useEffect(() => {
        if (!selectedConversation && conversations.length > 0) {
            setSelectedConversation(conversations[0]);
        }
    }, [conversations]);


    useEffect(() => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTo({
                top: scrollAreaViewportRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [selectedConversation?.messages]);

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        if (conversation.unreadCount > 0) {
            messageManager.markAsRead(conversation.participant, 'admin');
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const recipientUser = users.find(u => u.name === selectedConversation.participant);
        if (!recipientUser) return;

        messageManager.sendMessage({
            from: 'Amina Dauda', // Admin's name
            to: recipientUser.role,
            content: newMessage,
        });
        setNewMessage('');
    };

    const handleNewMessageSend = ({ recipient, content }: { recipient: string, content: string }) => {
        const recipientUser = users.find(u => u.name === recipient);
        if (!recipientUser) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not find the selected recipient.",
            });
            return;
        }

        messageManager.sendMessage({
            from: 'Amina Dauda',
            to: recipientUser.role,
            content: content,
        });

        setNewMessageDialogOpen(false);
        toast({
            title: "Message Sent",
            description: `Your message to ${recipient} has been sent.`,
        });

        // After sending, select the conversation
        setTimeout(() => {
             const updatedConversations = messageManager.getConversations('admin');
            const conversationToSelect = updatedConversations.find(c => c.participant === recipient);
            if (conversationToSelect) {
                handleSelectConversation(conversationToSelect);
            }
        }, 100);
    }
    
    const formatTimestamp = (timestamp: string) => {
        try {
            return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
        } catch (error) {
            return 'Invalid date';
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-4 h-[calc(100vh-8rem)]">
                <Card className="col-span-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                        <CardTitle className="text-xl">Inbox</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setNewMessageDialogOpen(true)}>
                            <Edit className="w-5 h-5"/>
                            <span className="sr-only">New Message</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-2 flex-1">
                        <ScrollArea className="h-full">
                            <div className="space-y-1">
                                {conversations.map((convo) => (
                                    <button
                                        key={convo.participant}
                                        onClick={() => handleSelectConversation(convo)}
                                        className={cn(
                                            'w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors',
                                            selectedConversation?.participant === convo.participant ? 'bg-muted' : 'hover:bg-muted/50'
                                        )}
                                    >
                                        <Avatar>
                                            <AvatarImage src={`https://placehold.co/40x40.png?text=${convo.participant.charAt(0)}`} data-ai-hint="person" />
                                            <AvatarFallback>{convo.participant.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 truncate">
                                            <div className="flex justify-between items-center">
                                                <p className={cn("font-semibold", convo.unreadCount > 0 && "font-bold")}>{convo.participant}</p>
                                                 <p className="text-xs text-muted-foreground">{formatTimestamp(convo.lastMessage.timestamp)}</p>
                                            </div>
                                            <div className="flex justify-between items-start mt-1">
                                                <p className={cn("text-sm text-muted-foreground truncate flex-1 pr-2", convo.unreadCount > 0 && "text-foreground")}>{convo.lastMessage.content}</p>
                                                {convo.unreadCount > 0 && (
                                                    <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                                                        {convo.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="col-span-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b flex-row items-center gap-3 p-4">
                               <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${selectedConversation.participant.charAt(0)}`} data-ai-hint="person" />
                                    <AvatarFallback>{selectedConversation.participant.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{selectedConversation.participant}</CardTitle>
                                    <div className="text-sm text-muted-foreground">
                                        {users.find(u => u.name === selectedConversation.participant)?.role}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <ScrollArea className="h-[calc(100vh-18.5rem)] p-6" viewportRef={scrollAreaViewportRef}>
                                    <div className="space-y-6">
                                        {selectedConversation.messages.map((msg) => (
                                            <div key={msg.id} className={cn("flex items-end gap-3", msg.from === 'Amina Dauda' ? "justify-end" : "justify-start")}>
                                                {msg.from !== 'Amina Dauda' && (
                                                    <Avatar className="w-8 h-8 self-start">
                                                        <AvatarImage src={`https://placehold.co/32x32.png?text=${msg.from.charAt(0)}`} data-ai-hint="person" />
                                                        <AvatarFallback>{msg.from.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={cn(
                                                    "p-3 rounded-lg max-w-sm lg:max-w-md shadow-sm relative text-sm",
                                                    msg.from === 'Amina Dauda' 
                                                        ? "bg-primary text-primary-foreground rounded-br-none" 
                                                        : "bg-muted rounded-bl-none"
                                                )}>
                                                    <p>{msg.content}</p>
                                                     <p className="text-xs opacity-75 mt-2 text-right">{formatTimestamp(msg.timestamp)}</p>
                                                </div>
                                                 {msg.from === 'Amina Dauda' && (
                                                    <Avatar className="w-8 h-8 self-start">
                                                        <AvatarImage src={`https://placehold.co/32x32.png?text=A`} data-ai-hint="person" />
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <div className="p-4 border-t bg-background">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                        autoComplete="off"
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                        <Send className="w-4 h-4"/>
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                            <MessageSquare className="w-20 h-20 mb-4 opacity-50" />
                            <h3 className="text-2xl font-semibold">Your Inbox</h3>
                            <p className="max-w-sm mx-auto">Select a conversation from the list to start chatting, or compose a new message to a staff member.</p>
                        </div>
                    )}
                </Card>
            </div>
            <NewMessageDialog
                isOpen={isNewMessageDialogOpen}
                onClose={() => setNewMessageDialogOpen(false)}
                onSendMessage={handleNewMessageSend}
            />
        </>
        );
    }

    