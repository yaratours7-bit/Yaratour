'use client';

import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Facebook, Instagram, Upload, Trash2, Users, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
}

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
}

export default function LeadsPoolPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAssignSheetOpen, setAssignSheetOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [page, setPage] = useState(0);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
const PAGE_SIZE = 8;

  const { data: unassignedLeads, isLoading: isLoadingUnassigned, isError: isErrorUnassigned } = useQuery({
    queryKey: ['unassigned-leads', page],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .is('user_id', null)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      return { data, count };
    },
  });

  const { data: assignedLeads, isLoading: isLoadingAssigned, isError: isErrorAssigned } = useQuery({
    queryKey: ['assigned-leads', page],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('leads')
        .select('*, profiles(first_name, last_name)', { count: 'exact' })
        .not('user_id', 'is', null)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      return { data, count };
    },
  });

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      return data;
    },
  });

  const assignLeadMutation = useMutation({
    mutationFn: async ({ leadId, agentId }: { leadId: string; agentId: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ user_id: agentId })
        .eq('id', leadId);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-leads'] });
      toast.success('Lead assigned successfully!');
      setAssignSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (leadId: string) => {
      setDeletingLeadId(leadId);
      const response = await fetch(`/api/leads?id=${leadId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete lead');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-leads'] });
      toast.success('Lead deleted successfully!');
      setDeletingLeadId(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setDeletingLeadId(null);
    },
  });

  const uploadCsvMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload CSV');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unassigned-leads'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-leads'] });
      
      if (data.duplicates > 0) {
        toast.success(`Successfully imported ${data.imported} leads. ${data.duplicates} duplicates were skipped.`);
      } else {
        toast.success(`Successfully imported ${data.imported} leads!`);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAssignLead = () => {
    if (selectedLead) {
      assignLeadMutation.mutate({
        leadId: selectedLead.id,
        agentId: selectedAgent,
      });
    }
  };

  const openAssignSheet = (lead: Lead) => {
    setSelectedLead(lead);
    setAssignSheetOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      uploadCsvMutation.mutate(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads Pool</h1>
        <div className="flex space-x-2">
          <Button>
            <Facebook className="mr-2 h-4 w-4" />
            Sync with Facebook Leads
          </Button>
          <Button>
            <Instagram className="mr-2 h-4 w-4" />
            Sync with Instagram Leads
          </Button>
          <Button 
            variant="outline" 
            onClick={triggerFileUpload}
            disabled={uploadCsvMutation.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadCsvMutation.isPending ? 'Uploading...' : 'Upload CSV'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(unassignedLeads?.count || 0) + (assignedLeads?.count || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All leads in the pool
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Leads</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {unassignedLeads?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting assignment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignedLeads?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently assigned
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unassigned" className="mt-6 flex flex-col flex-grow">
        <TabsList>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
        </TabsList>
        <TabsContent value="unassigned" className="flex-grow">
          <div className="bg-white p-4 rounded-lg flex-grow flex flex-col">
            {isLoadingUnassigned ? (
              <p>Loading...</p>
            ) : isErrorUnassigned ? (
              <p>Error loading leads.</p>
            ) : (
              <>
                <div className="flex-grow h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unassignedLeads?.data?.map((lead: Lead, index: number) => (
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
                          <TableCell>{lead.source}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openAssignSheet(lead)}
                              >
                                Assign
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteLeadMutation.mutate(lead.id)}
                                disabled={deletingLeadId === lead.id}
                              >
                                {deletingLeadId === lead.id ? (
                                  <span className="text-xs">Deleting...</span>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
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
                  <Button onClick={() => setPage(p => p + 1)} disabled={!unassignedLeads?.count || (page + 1) * PAGE_SIZE >= unassignedLeads.count}>Next</Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="assigned" className="flex-grow">
          <div className="bg-white p-4 rounded-lg flex-grow flex flex-col">
            {isLoadingAssigned ? (
              <p>Loading...</p>
            ) : isErrorAssigned ? (
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
                        <TableHead>Source</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedLeads?.data?.map((lead: any, index: number) => (
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
                          <TableCell>{lead.source}</TableCell>
                          <TableCell>{`${lead.profiles.first_name} ${lead.profiles.last_name}`}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteLeadMutation.mutate(lead.id)}
                              disabled={deletingLeadId === lead.id}
                            >
                              {deletingLeadId === lead.id ? (
                                <span className="text-xs">Deleting...</span>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
                  <span className="mx-4">Page {page + 1}</span>
                  <Button onClick={() => setPage(p => p + 1)} disabled={!assignedLeads?.count || (page + 1) * PAGE_SIZE >= assignedLeads.count}>Next</Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={isAssignSheetOpen} onOpenChange={setAssignSheetOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
            <DialogDescription>
              Assign this lead to an agent.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 grid gap-4">
            <Select onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents?.map((agent: Agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.first_name} {agent.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAssignLead}>Assign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
