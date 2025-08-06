
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role, roleNames, roles, User } from "@/lib/constants";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(roles),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
    // Passwords must match if a new password is provided
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


type FormData = z.infer<typeof formSchema>;

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSaved: (user: User, originalEmail?: string) => void;
  userToEdit: User | null;
}

export function CreateUserDialog({ isOpen, onClose, onUserSaved, userToEdit }: CreateUserDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "doctor",
      password: "",
      confirmPassword: ""
    },
  });

  const isEditing = !!userToEdit;

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
        if (userToEdit) {
          form.reset({
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
            password: "",
            confirmPassword: ""
          });
        } else {
          form.reset({
            name: "",
            email: "",
            role: "doctor",
            password: "",
            confirmPassword: ""
          });
        }
    }
  }, [userToEdit, form, isOpen]);


  function onSubmit(values: FormData) {
    // Don't submit if passwords are required but not provided for a new user
    if (!isEditing && !values.password) {
        form.setError("password", { type: "manual", message: "Password is required for new users." });
        return;
    }

    const userToSave: User = {
        name: values.name,
        email: values.email,
        role: values.role
    }

    // Only include the password if it's been provided
    if(values.password) {
        userToSave.password = values.password
    }
    
    onUserSaved(userToSave, userToEdit?.email);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
           <DialogDescription>
            {isEditing ? `Update the details for ${userToEdit.name}. Leave password blank to keep it unchanged.` : 'Fill in the details to create a new user account.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {roleNames[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEditing ? 'Leave blank to keep current' : 'Set a password'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create User'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
