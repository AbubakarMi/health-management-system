
"use client";

import { useState } from "react";
import { UserManagementTable } from "@/components/user-management-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { useToast } from "@/hooks/use-toast";
import { users as initialUsers, User } from "@/lib/constants";

export default function Page() {
    const [users, setUsers] = useState(initialUsers);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { toast } = useToast();

    const handleCreateClick = () => {
        setEditingUser(null);
        setDialogOpen(true);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setDialogOpen(true);
    };

    const handleDeleteUser = (email: string) => {
        // Also update the mock source
        const index = initialUsers.findIndex(u => u.email === email);
        if (index > -1) initialUsers.splice(index, 1);
        
        setUsers(initialUsers.filter(u => u.email !== email));
        toast({
            title: "User Deleted",
            description: `The user account has been successfully deleted.`,
            variant: "destructive",
        });
    };

    const handleSaveUser = (savedUser: User, originalEmail?: string) => {
        if (editingUser && originalEmail) {
            // Update existing user
            const updatedUsers = users.map(u => u.email === originalEmail ? { ...u, ...savedUser } : u);
            setUsers(updatedUsers);
            
            // Also update the mock source
            const index = initialUsers.findIndex(u => u.email === originalEmail);
            if (index > -1) initialUsers[index] = { ...initialUsers[index], ...savedUser };

            toast({ title: "User Updated", description: `Details for ${savedUser.name} have been updated.` });
        } else {
            // Add new user
            if (users.some(u => u.email.toLowerCase() === savedUser.email.toLowerCase())) {
                toast({ variant: "destructive", title: "User Exists", description: "A user with this email already exists." });
                return;
            }
            if (!savedUser.password) {
                toast({ variant: "destructive", title: "Password Required", description: "A password must be set for new users." });
                return;
            }
            const newUsers = [...users, savedUser];
            setUsers(newUsers);
            initialUsers.push(savedUser); // Update mock source
            toast({ title: "User Created", description: `${savedUser.name} has been added.` });
        }
        setDialogOpen(false);
    };


    return (
        <>
            <Card>
                <CardHeader>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                     <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Create, edit, and manage user accounts and roles.</CardDescription>
                     </div>
                     <Button onClick={handleCreateClick}>Create User</Button>
                   </div>
                </CardHeader>
                <CardContent>
                    <UserManagementTable 
                        users={users}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteUser}
                    />
                </CardContent>
            </Card>
            <CreateUserDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onUserSaved={handleSaveUser}
                userToEdit={editingUser}
            />
        </>
    )
}
