'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
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
import { useUser } from '@/app/hooks/useUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Phone, Briefcase, UserCheck, UserX } from 'lucide-react';

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface TeamMember {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
}

export default function TeamPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { user } = useUser();

  // State for create sheet
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const { data: team, isLoading, isError } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data;
    },
  });

  const { data: memberDetails } = useQuery({
    queryKey: ['memberDetails', selectedMember?.id],
    queryFn: async () => {
      if (!selectedMember) return null;

      const { data: leads } = await supabase
        .from('leads')
        .select('id, status')
        .eq('user_id', selectedMember.id);

      const { data: calls } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', selectedMember.id)
        .eq('title', 'Call');

      return {
        leadsClosed: leads?.filter((lead: { status: string }) => lead.status === 'Booked').length || 0,
        callsMade: calls?.length || 0,
      };
    },
    enabled: !!selectedMember,
  });

  const createMemberMutation = useMutation({
    mutationFn: async (newMember: Omit<TeamMember, 'id' | 'status'> & { password?: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Team member created successfully!');
      setCreateSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async (updatedMember: Partial<TeamMember>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedMember)
        .eq('id', updatedMember.id!)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Team member updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Team member deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateMember = () => {
    createMemberMutation.mutate({
      email,
      password,
      role,
      first_name: firstName,
      last_name: lastName,
      phone,
    });
  };

  const openViewSheet = (member: TeamMember) => {
    setSelectedMember(member);
    setViewSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team</h1>
        <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetTrigger asChild>
            <Button>New Member</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>New Team Member</SheetTitle>
              <SheetDescription>
                Add a new member to your team.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end p-6">
              <Button
                onClick={handleCreateMember}
                type="submit"
                className="w-full"
              >
                Save
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg flex-grow flex flex-col">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading team members.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                {user?.role === 'admin' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {team?.map((member: TeamMember, index: number) => (
                <motion.tr
                  key={member.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {user?.role === 'admin' ? (
                      <Select
                        value={member.status}
                        onValueChange={(status) =>
                          updateMemberMutation.mutate({ ...member, status })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      member.status
                    )}
                  </TableCell>
                  {user?.role === 'admin' && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewSheet(member)}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user and all their associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMemberMutation.mutate(member.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Sheet open={isViewSheetOpen} onOpenChange={setViewSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {selectedMember?.first_name} {selectedMember?.last_name}
            </SheetTitle>
            <SheetDescription>{selectedMember?.email}</SheetDescription>
          </SheetHeader>
          <div className="p-6 grid gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {selectedMember?.first_name} {selectedMember?.last_name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedMember?.email}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{selectedMember?.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{selectedMember?.role}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedMember?.status === 'active' ? (
                      <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <UserX className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span>{selectedMember?.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {memberDetails?.leadsClosed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leads Closed
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {memberDetails?.callsMade}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Calls Made
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
