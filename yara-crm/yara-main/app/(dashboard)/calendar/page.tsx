'use client';

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  lead_id?: string;
  account_id?: string;
  user_id: string;
  leads?: Lead;
  accounts?: Account;
  profiles?: { email: string };
  start?: Date;
  end?: Date;
}

interface Lead {
  id: string;
  name: string;
  phone?: string;
  country?: string;
}

interface Account {
  id: string;
  name: string;
  phone?: string;
  country?: string;
}

export default function CalendarPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [leadId, setLeadId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [attendeeType, setAttendeeType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewSheetOpen, setViewSheetOpen] = useState(false);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*, leads (id, name, phone, country), accounts (id, name, phone, country), profiles (email)');
      return (data || []).map(event => ({
        ...event,
        title: event.title || event.leads?.name || event.accounts?.name,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));
    },
  });

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data } = await supabase.from('leads').select('id, name');
      return data;
    },
  });

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await supabase.from('accounts').select('id, name');
      return data;
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Partial<Event>) => {
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
      setCreateSheetOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      createEventMutation.mutate({
        title,
        start_time: startTime,
        end_time: endTime,
        lead_id: leadId || undefined,
        account_id: accountId || undefined,
        user_id: user.id,
      });
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setViewSheetOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading events.</p>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetTrigger asChild>
            <Button>New Event</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>New Event</SheetTitle>
              <SheetDescription>
                Add a new event to the calendar.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">Start Time</Label>
                <Input id="start-time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">End Time</Label>
                <Input id="end-time" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attendeeType" className="text-right">Attendee Type</Label>
                <Select onValueChange={setAttendeeType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select attendee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {attendeeType === 'lead' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead" className="text-right">Lead</Label>
                  <Select onValueChange={setLeadId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads?.map((lead: Lead) => (
                        <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {attendeeType === 'account' && (
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
              )}
              </div>
              <div className="flex justify-end p-6">
                <Button
                  onClick={handleCreateEvent}
                  type="submit"
                  className="w-full"
                >
                  Save
                </Button>
              </div>
            </SheetContent>
        </Sheet>
      </div>
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          className="bg-white p-4 rounded-lg"
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <Sheet open={isViewSheetOpen} onOpenChange={setViewSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedEvent?.title}</SheetTitle>
            <SheetDescription>
              {moment(selectedEvent?.start).format('MMMM Do YYYY, h:mm a')} - {moment(selectedEvent?.end).format('h:mm a')}
            </SheetDescription>
          </SheetHeader>
          <div className="p-6 grid gap-4">
            <div>
              <h3 className="font-bold mb-2">Agent</h3>
              <p>{selectedEvent?.profiles?.email}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Attendee</h3>
              <p>{selectedEvent?.leads?.name || selectedEvent?.accounts?.name}</p>
              <p>{selectedEvent?.leads?.phone || selectedEvent?.accounts?.phone}</p>
              <p>{selectedEvent?.leads?.country || selectedEvent?.accounts?.country}</p>
            </div>
            <Button onClick={() => {
              if (selectedEvent?.leads) {
                window.open(`/leads?id=${selectedEvent.leads.id}`, '_blank');
              } else if (selectedEvent?.accounts) {
                window.open(`/accounts?id=${selectedEvent.accounts.id}`, '_blank');
              }
            }}>
              Open Profile
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
