'use client';

import React, { useState, useEffect } from 'react';
import { useCall } from '../../hooks/useCall';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  PhoneCall,
  User,
  Minimize2,
  Maximize2,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CallToast: React.FC = () => {
  const { call, status, endCall, acceptCall, rejectCall, toggleMute, isMuted } = useCall();
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!call) {
    return null;
  }

  const isIncoming = status === 'Incoming...';
  const isActive = status === 'In progress';
  const callerInfo = call.parameters?.From || call.parameters?.To || 'Unknown';

  const getStatusColor = () => {
    switch (status) {
      case 'Incoming...': return 'bg-purple-500';
      case 'In progress': return 'bg-green-500';
      case 'Calling...': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Card className={`bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden ${
          isMinimized ? 'w-80' : 'w-96'
        } transition-all duration-300`}>
          {/* Header */}
          <div className={`${getStatusColor()} px-4 py-3 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {isIncoming ? (
                    <Phone className="h-5 w-5" />
                  ) : (
                    <PhoneCall className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {isIncoming ? 'Incoming Call' : isActive ? 'Active Call' : 'Calling...'}
                  </p>
                  <p className="text-xs opacity-90">{callerInfo}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4"
              >
                {/* Call Info */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {callerInfo}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {status}
                  </Badge>
                  {isActive && (
                    <p className="text-2xl font-mono text-gray-600 dark:text-gray-300 mt-2">
                      {formatDuration(callDuration)}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                  {isIncoming ? (
                    <>
                      <Button
                        onClick={acceptCall}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0"
                      >
                        <Phone className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={rejectCall}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 p-0"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {isActive && (
                        <Button
                          onClick={toggleMute}
                          variant="outline"
                          size="lg"
                          className={`rounded-full w-12 h-12 p-0 ${
                            isMuted 
                              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                      )}
                      <Button
                        onClick={endCall}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 p-0"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Additional Controls for Active Calls */}
                {isActive && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Speaker
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Hold
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized View */}
          {isMinimized && (
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {isActive ? formatDuration(callDuration) : status}
                </span>
              </div>
              <Button
                onClick={endCall}
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 rounded-full"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallToast;
