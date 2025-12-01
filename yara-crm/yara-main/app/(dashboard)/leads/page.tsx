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
import { X, CreditCard, Mail, CheckCircle } from 'lucide-react';
import { useCall } from '../../hooks/useCall';
import { useUser } from '../../hooks/useUser';
import { format } from 'date-fns';

const PAGE_SIZE = 8;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_dates: string;
  num_travelers: number;
  budget: number;
  source: string;
  // New schema fields
  created: string | null;
  form: string | null;
  channel: string | null;
  stage: string | null;
  owner: string | null;
  label: string | null;
  secondary_phone: string | null;
  whatsapp_number: string | null;
}

interface Note {
  id: string;
  content: string;
  lead_id: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  lead_id: string;
  status: 'sent' | 'received';
}

interface Document {
  id: string;
  name: string;
  url: string;
  lead_id: string;
}

export default function LeadsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { makeCall } = useCall();
  const { user } = useUser();
  
  // State for create sheet
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [numTravelers, setNumTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('New');
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);

  // State for edit sheet
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  // State for pagination and filtering
  const [page, setPage] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const searchParams = useSearchParams();

  // State for tabs
  const [newNote, setNewNote] = useState('');
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentDate, setNewPaymentDate] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('PayFast');
  const [newDocument, setNewDocument] = useState<File | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', page, sourceFilter, statusFilter],
    queryFn: async () => {
      // Show ALL leads, not just those assigned to the current user
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' });

      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('stage', statusFilter);
      }

      const { data, count } = await query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      return { leads: data, count };
    },
  });

  const leads = data?.leads;
  const count = data?.count;

  const { data: notes } = useQuery({
    queryKey: ['notes', editingLead?.id],
    queryFn: async () => {
      if (!editingLead) return [];
      const { data } = await supabase.from('notes').select('*').eq('lead_id', editingLead.id);
      return data;
    },
    enabled: !!editingLead,
  });

  const { data: payments, refetch: refetchPayments } = useQuery({
    queryKey: ['payments', editingLead?.id],
    queryFn: async () => {
      if (!editingLead) return [];
      const { data } = await supabase.from('payments').select('*').eq('lead_id', editingLead.id).order('date', { ascending: false });
      return data;
    },
    enabled: !!editingLead,
  });

  const { data: documents } = useQuery({
    queryKey: ['documents', editingLead?.id],
    queryFn: async () => {
      if (!editingLead) return [];
      const { data } = await supabase.from('documents').select('*').eq('lead_id', editingLead.id);
      return data;
    },
    enabled: !!editingLead,
  });

  const createLeadMutation = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
      setCreateSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (updatedLead: Partial<Lead>) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', updatedLead.id!)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully!');
      setEditSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const createMultipleLeadsMutation = useMutation({
    mutationFn: async (newLeads: Partial<Lead>[]) => {
      const { data, error } = await supabase.from('leads').insert(newLeads);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Leads imported successfully!');
    },
    onError: (error) => {
      toast.error(`Error importing leads: ${error.message}`);
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Partial<Note>) => {
      const { data, error } = await supabase.from('notes').insert([newNote]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', editingLead?.id] });
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
      refetchPayments();
      setNewPaymentAmount('');
      setNewPaymentMethod('PayFast');
      toast.success('Payment record created!');
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (updatedPayment: Partial<Payment>) => {
      const { data, error } = await supabase
        .from('payments')
        .update(updatedPayment)
        .eq('id', updatedPayment.id!)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      refetchPayments();
      toast.success('Payment updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (newDocument: { lead_id: string; name: string; url: string; user_id: string; }) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editingLead?.id] });
      setNewDocument(null);
      toast.success('Document uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateLead = () => {
    createLeadMutation.mutate({
      name,
      email,
      phone,
      destination,
      travel_dates: travelDates,
      num_travelers: Number(numTravelers),
      budget: Number(budget),
      source,
      // Map UI "status" to new "stage" column
      stage: status,
      created: new Date().toISOString(),
      form: 'CRM',
      channel: 'CRM',
    });
  };

  const handleUpdateLead = () => {
    if (editingLead) {
      updateLeadMutation.mutate(editingLead);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLeadMutation.mutate(id);
    }
  };
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          createMultipleLeadsMutation.mutate(results.data as Partial<Lead>[]);
        },
      });
    }
  };

  const handleCreateNote = () => {
    if (editingLead) {
      createNoteMutation.mutate({ lead_id: editingLead.id, content: newNote });
    }
  };

  const handleSendPaymentLink = async () => {
    if (editingLead) {
      const paymentLink = `https://payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&amount=${newPaymentAmount}&item_name=Payment for ${editingLead.name}`;
      
      try {
        const response = await fetch('/api/send-payment-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: editingLead.email, paymentLink }),
        });

        if (response.ok) {
          toast.success('Payment link sent successfully!');
          createPaymentMutation.mutate({ 
            lead_id: editingLead.id, 
            amount: Number(newPaymentAmount), 
            date: new Date().toISOString(), 
            method: newPaymentMethod,
            status: 'sent'
          });
        } else {
          toast.error('Failed to send payment link.');
        }
      } catch (error) {
        toast.error('An error occurred while sending the payment link.');
      }
    }
  };

  const handleMarkAsReceived = (paymentId: string) => {
    updatePaymentMutation.mutate({ id: paymentId, status: 'received' });
  };

  const handleCreateDocument = async () => {
    if (newDocument && editingLead && user) {
      const sanitizedFileName = newDocument.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `${editingLead.id}/${sanitizedFileName}`;
      
      const { data, error } = await supabase.storage.from('documents').upload(filePath, newDocument);
      if (error) {
        toast.error(error.message);
      } else {
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(data.path);
        createDocumentMutation.mutate({ lead_id: editingLead.id, name: newDocument.name, url: publicUrlData.publicUrl, user_id: user.id });
      }
    }
  };

  const openEditSheet = (lead: Lead) => {
    setEditingLead(lead);
    setEditSheetOpen(true);
  };

  useEffect(() => {
    const leadId = searchParams.get('id');
    if (leadId && leads) {
      const leadToEdit = leads.find((lead: Lead) => lead.id === leadId);
      if (leadToEdit) {
        openEditSheet(leadToEdit);
      }
    }
  }, [searchParams, leads]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Quoted">Quoted</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Input type="file" accept=".csv" onChange={handleCsvUpload} className="w-auto" />
          <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
            <SheetTrigger asChild>
              <Button>New Lead</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>New Lead</SheetTitle>
                <SheetDescription>
                  Add a new lead to the pool.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 p-6">
                {/* Form fields for creating a new lead */}
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select onValueChange={setStatus} defaultValue="New">
                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Quoted">Quoted</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end p-6">
                <Button
                  onClick={handleCreateLead}
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

      {/* Edit Lead Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-2xl flex flex-col h-full">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>{editingLead?.name}</SheetTitle>
              <div className="flex gap-2">
                <Button onClick={() => editingLead && handleDeleteLead(editingLead.id)} variant="destructive">Delete</Button>
                <Button onClick={handleUpdateLead} type="submit">Save</Button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
            <SheetDescription>
              Update the details of this lead.
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
                  {/* Form fields for editing a lead */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name-edit" className="text-right">Name</Label>
                    <Input id="name-edit" value={editingLead?.name || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, name: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email-edit" className="text-right">Email</Label>
                    <Input id="email-edit" type="email" value={editingLead?.email || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, email: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone-edit" className="text-right">Phone</Label>
                    <Input id="phone-edit" value={editingLead?.phone || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, phone: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destination-edit" className="text-right">Destination</Label>
                    <Input id="destination-edit" value={editingLead?.destination || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, destination: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="travel-dates-edit" className="text-right">Travel Dates</Label>
                    <Input id="travel-dates-edit" value={editingLead?.travel_dates || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, travel_dates: e.target.value } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="num-travelers-edit" className="text-right">Travelers</Label>
                    <Input id="num-travelers-edit" type="number" value={editingLead?.num_travelers || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, num_travelers: Number(e.target.value) } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget-edit" className="text-right">Budget</Label>
                    <Input id="budget-edit" type="number" value={editingLead?.budget || ''} onChange={(e) => setEditingLead(prev => prev ? { ...prev, budget: Number(e.target.value) } : null)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source-edit" className="text-right">Source</Label>
                    <Select value={editingLead?.source} onValueChange={(value) => setEditingLead(prev => prev ? { ...prev, source: value } : null)}>
                      <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a source" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status-edit" className="text-right">Stage</Label>
                    <Select value={editingLead?.status} onValueChange={(value) => setEditingLead(prev => prev ? { ...prev, status: value } : null)}>
                      <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Quoted">Quoted</SelectItem>
                        <SelectItem value="Booked">Booked</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
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
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-4">Send New Payment Link</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <Input type="number" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} placeholder="Amount" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select onValueChange={setNewPaymentMethod} defaultValue="PayFast">
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PayFast">PayFast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleSendPaymentLink} className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Send Payment Link
                      </Button>
                    </div>
                  </div>
                  
                  <div className="h-[400px] overflow-y-auto p-4">
                    <h3 className="font-semibold mb-4">Payment History</h3>
                    <div className="relative border-l-2 border-gray-200 pl-6 space-y-8">
                      {payments?.map((payment: Payment) => (
                        <div key={payment.id} className="relative">
                          <div className="absolute -left-8 top-1.5 h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center">
                            {payment.status === 'received' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Mail className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">{payment.status === 'sent' ? 'Payment Link Sent' : 'Payment Received'}</p>
                              {payment.status === 'sent' && (
                                <Button size="sm" onClick={() => handleMarkAsReceived(payment.id)}>Mark as Received</Button>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {format(new Date(payment.date), 'PPP p')}
                            </p>
                            <p>Amount: ${payment.amount}</p>
                            <p>Method: {payment.method}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
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
          <p>Error loading leads.</p>
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
                    <TableHead>Stage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.map((lead: Lead, index: number) => (
                    <motion.tr
                      key={lead.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.destination}</TableCell>
                      <TableCell>{lead.stage}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditSheet(lead)}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => makeCall(lead.phone)}>Call</Button>
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
