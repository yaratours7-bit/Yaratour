'use client';

import { useState, useEffect } from 'react';
import { useCall } from '@/app/hooks/useCall';
import { useUser } from '@/app/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing,
  Clock,
  User,
  Volume2,
  VolumeX,
  Pause,
  Play,
  MoreVertical,
  History,
  Users,
  Settings,
  Search,
  Loader2,
  RefreshCw,
  Plus,
  Delete
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallLogEntry {
  id: string;
  phone_number: string;
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'busy' | 'failed' | 'no-answer';
  duration: number;
  started_at: string;
  ended_at?: string;
  notes?: string;
  leads?: { name: string; email: string } | null;
  contacts?: { name: string; email: string } | null;
}

interface CallAnalytics {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  avgDuration: string;
  answerRate: number;
  incomingCalls: number;
  outgoingCalls: number;
  callQuality: number;
}

export default function CallsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(80);
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);
  const [analytics, setAnalytics] = useState<CallAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { call, makeCall, endCall, status, isMuted, toggleMute, acceptCall, rejectCall } = useCall();
  const { user } = useUser();

  // Fetch calls data
  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/calls');
      if (response.ok) {
        const data = await response.json();
        setCallLog(data.calls || []);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/calls/analytics?period=today');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCalls(), fetchAnalytics()]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Auto-refresh data when call status changes
  useEffect(() => {
    if (status === 'Idle' && user) {
      // Refresh data after a call ends
      const timer = setTimeout(() => {
        fetchCalls();
        fetchAnalytics();
      }, 1000); // Wait 1 second to ensure call is saved

      return () => clearTimeout(timer);
    }
  }, [status, user]);

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchCalls(), fetchAnalytics()]);
    setIsRefreshing(false);
  };

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (call && status === 'In progress') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [call, status]);

  // Helper functions
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatCallDuration = (seconds: number) => {
    if (seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallTypeIcon = (direction: string, status: string) => {
    if (status === 'missed' || status === 'no-answer' || status === 'busy') {
      return <PhoneOff className="h-5 w-5" />;
    }
    return direction === 'incoming' ? <PhoneIncoming className="h-5 w-5" /> : <PhoneOutgoing className="h-5 w-5" />;
  };

  const getCallTypeColor = (direction: string, status: string) => {
    if (status === 'missed' || status === 'no-answer' || status === 'busy') {
      return 'bg-red-100 text-red-600';
    }
    return direction === 'incoming' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600';
  };

  const handleCall = () => {
    if (call) {
      endCall();
    } else {
      if (status !== 'Ready') {
        console.warn('Device not ready, current status:', status);
        return;
      }
      makeCall(phoneNumber);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Ready': return 'bg-green-500';
      case 'Calling...': return 'bg-yellow-500';
      case 'In progress': return 'bg-blue-500';
      case 'Incoming...': return 'bg-purple-500';
      case 'Connecting...': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const handleDialpadClick = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleAddPlus = () => {
    if (phoneNumber === '' || phoneNumber.charAt(0) !== '+') {
      setPhoneNumber(prev => '+' + prev);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const isCallDisabled = !phoneNumber || (status !== 'Ready' && !call);
  const isIncoming = status === 'Incoming...';

  return (
    <div className="flex flex-col h-full p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Call Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your calls and communications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
            <span>{status}</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        {/* Dialer Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Active Call Display */}
          <AnimatePresence>
            {call && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneCall className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {isIncoming ? 'Incoming Call' : 'Active Call'}
                  </h3>
                  <p className="text-blue-100 mb-2">{phoneNumber}</p>
                  <p className="text-2xl font-mono">{formatDuration(callDuration)}</p>
                  
                  {isIncoming ? (
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button
                        onClick={acceptCall}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14"
                      >
                        <Phone className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={rejectCall}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button
                        onClick={toggleMute}
                        variant="outline"
                        size="lg"
                        className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white border-white/30'}`}
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                      <Button
                        onClick={() => setIsRecording(!isRecording)}
                        variant="outline"
                        size="lg"
                        className={`rounded-full w-12 h-12 ${isRecording ? 'bg-red-500 text-white' : 'bg-white/20 text-white border-white/30'}`}
                      >
                        {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <Button
                        onClick={endCall}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dialer Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Dialer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="Enter phone number or search contacts"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!!call}
                  className="text-lg h-12 pr-10"
                />
                <Search className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
              </div>

              {/* Dialpad */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {dialpadNumbers.flat().map((digit) => (
                  <Button
                    key={digit}
                    variant="outline"
                    onClick={() => handleDialpadClick(digit)}
                    disabled={!!call}
                    className="h-12 text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {digit}
                  </Button>
                ))}
              </div>

              {/* Additional Controls Row */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={handleAddPlus}
                  disabled={!!call}
                  className="h-12 text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <div></div> {/* Empty space in the middle */}
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={!!call || !phoneNumber}
                  className="h-12 text-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                >
                  <Delete className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                onClick={handleCall} 
                className="w-full h-12 text-lg font-semibold" 
                disabled={isCallDisabled}
                size="lg"
              >
                {call ? (
                  <>
                    <PhoneOff className="mr-2 h-5 w-5" />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Call
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <History className="h-4 w-4 mr-2" />
                  Recents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-2">
          <Tabs defaultValue="activity" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Call Activity</TabsTrigger>
              <TabsTrigger value="history">Call History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading calls...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {callLog.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCallTypeColor(entry.direction, entry.status)}`}>
                              {getCallTypeIcon(entry.direction, entry.status)}
                            </div>
                            <div>
                              <p className="font-medium">{entry.phone_number}</p>
                              <p className="text-sm text-gray-500">{formatTimestamp(entry.started_at)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCallDuration(entry.duration)}</p>
                            <Badge variant={entry.status === 'completed' ? 'default' : 'destructive'}>
                              {entry.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {callLog.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No recent calls found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle>Call History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading call history...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {callLog.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCallTypeColor(entry.direction, entry.status)}`}>
                              {getCallTypeIcon(entry.direction, entry.status)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{entry.phone_number}</p>
                              <p className="text-xs text-gray-500">{formatTimestamp(entry.started_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{formatCallDuration(entry.duration)}</span>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {callLog.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No call history found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading analytics...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Today's Stats</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={refreshData}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Calls</span>
                          <span className="font-semibold text-2xl">{analytics?.totalCalls || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Answered</span>
                          <span className="font-semibold text-2xl text-green-600">{analytics?.answeredCalls || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Missed</span>
                          <span className="font-semibold text-2xl text-red-600">{analytics?.missedCalls || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg Duration</span>
                          <span className="font-semibold text-2xl">{analytics?.avgDuration || '0:00'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Answer Rate</span>
                            <span className="text-sm font-medium">{analytics?.answerRate || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${analytics?.answerRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Call Quality</span>
                            <span className="text-sm font-medium">{analytics?.callQuality || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${analytics?.callQuality || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Incoming Calls</span>
                            <span className="text-sm font-medium">{analytics?.incomingCalls || 0}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Outgoing Calls</span>
                            <span className="text-sm font-medium">{analytics?.outgoingCalls || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
