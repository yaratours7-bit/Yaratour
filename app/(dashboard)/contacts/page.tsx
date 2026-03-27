'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCall } from '../../hooks/useCall';

const PAGE_SIZE = 10;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  account_id: string;
  accounts?: {
    id: string;
    name: string;
  };
}

interface Account {
  id: string;
  name: string;
}

export default function ContactsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { makeCall } = useCall();
  
  // State for create sheet
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountId, setAccountId] = useState('');
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);

  // State for edit sheet
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  // State for pagination
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('contacts')
        .select(`
          id,
          name,
          email,
          phone,
          account_id,
          accounts (
            id,
            name
          )
        `, { count: 'exact' })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      return { contacts: data as unknown as Contact[], count };
    },
  });

  const contacts = data?.contacts;
  const count = data?.count;

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await supabase.from('accounts').select('id, name');
      return data;
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (newContact: Partial<Contact>) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully!');
      setCreateSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async (updatedContact: Partial<Contact>) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updatedContact)
        .eq('id', updatedContact.id!)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully!');
      setEditSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateContact = () => {
    createContactMutation.mutate({ name, email, phone, account_id: accountId });
  };

  const handleUpdateContact = () => {
    if (editingContact) {
      updateContactMutation.mutate(editingContact);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContactMutation.mutate(id);
    }
  };

  const openEditSheet = (contact: Contact) => {
    setEditingContact(contact);
    setEditSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetTrigger asChild>
            <Button>New Contact</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>New Contact</SheetTitle>
              <SheetDescription>
                Add a new contact.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="account" className="text-right">Account</Label>
                <Select onValueChange={setAccountId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account: Account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end p-6">
              <Button
                onClick={handleCreateContact}
                type="submit"
                className="w-full"
              >
                Save
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Edit Contact Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>{editingContact?.name}</SheetTitle>
              <div className="flex gap-2">
                <Button onClick={() => editingContact && handleDeleteContact(editingContact.id)} variant="destructive">Delete</Button>
                <Button onClick={handleUpdateContact} type="submit">Save</Button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
            <SheetDescription>
              Update the details of this contact.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 p-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name-edit" className="text-right">Name</Label>
              <Input id="name-edit" value={editingContact?.name || ''} onChange={(e) => setEditingContact(prev => prev ? { ...prev, name: e.target.value } : null)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-edit" className="text-right">Email</Label>
              <Input id="email-edit" type="email" value={editingContact?.email || ''} onChange={(e) => setEditingContact(prev => prev ? { ...prev, email: e.target.value } : null)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone-edit" className="text-right">Phone</Label>
              <Input id="phone-edit" value={editingContact?.phone || ''} onChange={(e) => setEditingContact(prev => prev ? { ...prev, phone: e.target.value } : null)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-edit" className="text-right">Account</Label>
              <Select value={editingContact?.accounts?.id} onValueChange={(value) => setEditingContact(prev => prev ? { ...prev, account_id: value } : null)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account: Account) => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="mt-8 bg-white p-4 rounded-lg flex-grow flex flex-col">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading contacts.</p>
        ) : (
          <>
            <div className="flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts?.map((contact: Contact, index: number) => (
                    <motion.tr
                      key={contact.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.accounts?.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditSheet(contact)}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => makeCall(contact.phone)}>Call</Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
              <span className="mx-4">Page {page + 1}</span>
              <Button onClick={() => setPage(p => p + 1)} disabled={!count || (page + 1) * PAGE_SIZE >= count}>Next</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
