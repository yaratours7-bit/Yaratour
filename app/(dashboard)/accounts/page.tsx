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
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useCall } from '../../hooks/useCall';

const PAGE_SIZE = 10;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_dates: string;
  num_travelers: number;
  budget: number;
  source: string;
  country: string;
}

interface Note {
  id: string;
  content: string;
  account_id: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  account_id: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  account_id: string;
}

export default function AccountsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { makeCall } = useCall();
  
  // State for create sheet
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [numTravelers, setNumTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState('');
  const [country, setCountry] = useState('');
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);

  // State for edit sheet
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  // State for pagination and filtering
  const [page, setPage] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('all');
  const searchParams = useSearchParams();

  // State for tabs
  const [newNote, setNewNote] = useState('');
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentDate, setNewPaymentDate] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newDocument, setNewDocument] = useState<File | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['accounts', page, sourceFilter],
    queryFn: async () => {
      let query = supabase
        .from('accounts')
        .select('*', { count: 'exact' });

      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter);
      }

      const { data, count } = await query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      return { accounts: data, count };
    },
  });

  const accounts = data?.accounts;
  const count = data?.count;

  const { data: notes } = useQuery({
    queryKey: ['notes', editingAccount?.id],
    queryFn: async () => {
      if (!editingAccount) return [];
      const { data } = await supabase.from('notes').select('*').eq('account_id', editingAccount.id);
      return data;
    },
    enabled: !!editingAccount,
  });

  const { data: payments } = useQuery({
    queryKey: ['payments', editingAccount?.id],
    queryFn: async () => {
      if (!editingAccount) return [];
      const { data } = await supabase.from('payments').select('*').eq('account_id', editingAccount.id);
      return data;
    },
    enabled: !!editingAccount,
  });

  const { data: documents } = useQuery({
    queryKey: ['documents', editingAccount?.id],
    queryFn: async () => {
      if (!editingAccount) return [];
      const { data } = await supabase.from('documents').select('*').eq('account_id', editingAccount.id);
      return data;
    },
    enabled: !!editingAccount,
  });

  const createAccountMutation = useMutation({
    mutationFn: async (newAccount: Partial<Account>) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert([newAccount])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created successfully!');
      setCreateSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (updatedAccount: Account) => {
      const { data, error } = await supabase
        .from('accounts')
        .update(updatedAccount)
        .eq('id', updatedAccount.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account updated successfully!');
      setEditSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const createMultipleAccountsMutation = useMutation({
    mutationFn: async (newAccounts: Partial<Account>[]) => {
      const { data, error } = await supabase.from('accounts').insert(newAccounts);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Accounts imported successfully!');
    },
    onError: (error) => {
      toast.error(`Error importing accounts: ${error.message}`);
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Partial<Note>) => {
      const { data, error } = await supabase.from('notes').insert([newNote]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', editingAccount?.id] });
      setNewNote('');
      toast.success('Note added successfully!');
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (newPayment: Partial<Payment>) => {
      const { data, error } = await supabase.from('payments').insert([newPayment]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', editingAccount?.id] });
      setNewPaymentAmount('');
      setNewPaymentDate('');
      setNewPaymentMethod('');
      toast.success('Payment added successfully!');
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (newDocument: Partial<Document>) => {
      const { data, error } = await supabase.from('documents').insert([newDocument]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editingAccount?.id] });
      setNewDocument(null);
      toast.success('Document uploaded successfully!');
    },
  });

  const handleCreateAccount = () => {
    createAccountMutation.mutate({ name, email, phone, destination, travel_dates: travelDates, num_travelers: Number(numTravelers), budget: Number(budget), source, country });
  };

  const handleUpdateAccount = () => {
    if (editingAccount) {
      updateAccountMutation.mutate(editingAccount);
    }
  };

  const handleDeleteAccount = (id: string) => {
    // Guard against server-side or build-time execution where `window` is not defined.
    if (typeof window === 'undefined') {
      return;
    }

    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccountMutation.mutate(id);
    }
  };
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          createMultipleAccountsMutation.mutate(results.data as Partial<Account>[]);
        },
      });
    }
  };

  const handleCreateNote = () => {
    if (editingAccount) {
      createNoteMutation.mutate({ account_id: editingAccount.id, content: newNote });
    }
  };

  const handleCreatePayment = () => {
    if (editingAccount) {
      createPaymentMutation.mutate({ account_id: editingAccount.id, amount: Number(newPaymentAmount), date: newPaymentDate, method: newPaymentMethod });
    }
  };

  const handleCreateDocument = async () => {
    if (newDocument && editingAccount) {
      const { data, error } = await supabase.storage.from('documents').upload(`${editingAccount.id}/${newDocument.name}`, newDocument);
      if (error) {
        toast.error(error.message);
      } else {
        createDocumentMutation.mutate({ account_id: editingAccount.id, name: newDocument.name, url: data.path });
      }
    }
  };

  const openEditSheet = (account: Account) => {
    setEditingAccount(account);
    setEditSheetOpen(true);
  };

  useEffect(() => {
    const accountId = searchParams.get('id');
    if (accountId && accounts) {
      const accountToEdit = accounts.find((account: Account) => account.id === accountId);
      if (accountToEdit) {
        openEditSheet(accountToEdit);
      }
    }
  }, [searchParams, accounts]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <div className="flex items-center gap-2">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
            </SelectContent>
          </Select>
          <Input type="file" accept=".csv" onChange={handleCsvUpload} className="w-auto" />
          <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
            <SheetTrigger asChild>
              <Button>New Account</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>New Account</SheetTitle>
                <SheetDescription>
                  Add a new account to the pool.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 p-6">
                {/* Form fields for creating a new account */}
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
                  <Label htmlFor="destination" className="text-right">Destination</Label>
                  <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="travel-dates" className="text-right">Travel Dates</Label>
                  <Input id="travel-dates" value={travelDates} onChange={(e) => setTravelDates(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="num-travelers" className="text-right">Travelers</Label>
                  <Input id="num-travelers" type="number" value={numTravelers} onChange={(e) => setNumTravelers(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">Budget</Label>
                  <Input id="budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">Country</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="source" className="text-right">Source</Label>
                  <Select onValueChange={setSource}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a source" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end p-6">
                <Button
                  onClick={handleCreateAccount}
                  type="submit"
                  className="w-full"
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Edit Account Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-2xl flex flex-col h-full">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>{editingAccount?.name}</SheetTitle>
              <div className="flex gap-2">
                <Button onClick={() => editingAccount && handleDeleteAccount(editingAccount.id)} variant="destructive">Delete</Button>
                <Button onClick={handleUpdateAccount} type="submit">Save</Button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
            <SheetDescription>
              Update the details of this account.
            </SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details" className="mt-4 flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="details" className="p-6">
                <div className="grid gap-4">
                  {/* Form fields for editing an account */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name-edit" className="text-right">Name</Label>
                    <Input id="name-edit" value={editingAccount?.name || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, name: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email-edit" className="text-right">Email</Label>
                    <Input id="email-edit" type="email" value={editingAccount?.email || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, email: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone-edit" className="text-right">Phone</Label>
                    <Input id="phone-edit" value={editingAccount?.phone || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, phone: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destination-edit" className="text-right">Destination</Label>
                    <Input id="destination-edit" value={editingAccount?.destination || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, destination: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="travel-dates-edit" className="text-right">Travel Dates</Label>
                    <Input id="travel-dates-edit" value={editingAccount?.travel_dates || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, travel_dates: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="num-travelers-edit" className="text-right">Travelers</Label>
                    <Input id="num-travelers-edit" type="number" value={editingAccount?.num_travelers || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, num_travelers: Number(e.target.value) } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget-edit" className="text-right">Budget</Label>
                    <Input id="budget-edit" type="number" value={editingAccount?.budget || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, budget: Number(e.target.value) } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country-edit" className="text-right">Country</Label>
                    <Input id="country-edit" value={editingAccount?.country || ''} onChange={(e) => setEditingAccount(prev => prev ? { ...prev, country: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source-edit" className="text-right">Source</Label>
                    <Select value={editingAccount?.source} onValueChange={(value) => setEditingAccount(prev => prev ? { ...prev, source: value } : null)}>
                      <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a source" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="p-6">
                <div>
                  <div className="grid gap-4">
                    <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a new note..." />
                    <Button onClick={handleCreateNote}>Add Note</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {notes?.map((note: Note) => (
                      <div key={note.id} className="p-2 border rounded-md">{note.content}</div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="payments" className="p-6">
                <div>
                  <div className="grid gap-4">
                    <Input type="number" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} placeholder="Amount" />
                    <Input type="date" value={newPaymentDate} onChange={(e) => setNewPaymentDate(e.target.value)} />
                    <Input value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} placeholder="Payment Method" />
                    <Button onClick={handleCreatePayment}>Add Payment</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {payments?.map((payment: Payment) => (
                      <div key={payment.id} className="p-2 border rounded-md">
                        {payment.amount} - {payment.date} - {payment.method}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="p-6">
                <div>
                  <div className="grid gap-4">
                    <Input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDocument(e.target.files?.[0] || null)} />
                    <Button onClick={handleCreateDocument}>Upload Document</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {documents?.map((doc: Document) => (
                      <div key={doc.id} className="p-2 border rounded-md">
                        <a href={supabase.storage.from('documents').getPublicUrl(doc.url).data.publicUrl} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>

      <div className="mt-8 bg-white p-4 rounded-lg flex-grow flex flex-col">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading accounts.</p>
        ) : (
          <>
            <div className="flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts?.map((account: Account, index: number) => (
                    <motion.tr
                      key={account.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.phone}</TableCell>
                      <TableCell>{account.destination}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditSheet(account)}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => makeCall(account.phone)}>Call</Button>
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
