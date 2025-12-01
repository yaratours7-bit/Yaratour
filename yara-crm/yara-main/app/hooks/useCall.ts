import { create } from 'zustand';
import { initializeTwilio, makeCall as twilioMakeCall, hangUp } from '../components/lib/twilio/client';
import { Device, Call } from '@twilio/voice-sdk';
import { toast } from 'sonner';

interface CallState {
  device: Device | null;
  call: Call | null;
  status: string;
  isMuted: boolean;
  callStartTime: Date | null;
  currentPhoneNumber: string | null;
  makeCall: (phoneNumber: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  initTwilio: () => Promise<void>;
}

// Helper function to save call to database
const saveCallToDatabase = async (callData: {
  phone_number: string;
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'busy' | 'failed' | 'no-answer';
  duration?: number;
  call_sid?: string;
}) => {
  try {
    const response = await fetch('/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callData),
    });

    if (!response.ok) {
      console.error('Failed to save call to database');
    }
  } catch (error) {
    console.error('Error saving call to database:', error);
  }
};

export const useCall = create<CallState>((set, get) => ({
  device: null,
  call: null,
  status: 'Idle',
  isMuted: false,
  callStartTime: null,
  currentPhoneNumber: null,
  makeCall: async (phoneNumber) => {
    console.log('Attempting to make call to:', phoneNumber);
    const { device } = get();
    if (!device) {
      console.error('Twilio device not initialized');
      return;
    }
    try {
      const call = await twilioMakeCall({ To: phoneNumber });
      console.log('Call object created:', call);
      const startTime = new Date();
      set({ 
        call, 
        status: 'Calling...', 
        currentPhoneNumber: phoneNumber,
        callStartTime: startTime
      });

      call.on('accept', () => {
        console.log('Call accepted');
        set({ status: 'In progress', callStartTime: new Date() });
      });

      call.on('disconnect', () => {
        console.log('Call disconnected');
        const { callStartTime, currentPhoneNumber } = get();
        
        // Calculate duration and save call
        const duration = callStartTime ? Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000) : 0;
        
        if (currentPhoneNumber) {
          saveCallToDatabase({
            phone_number: currentPhoneNumber,
            direction: 'outgoing',
            status: 'completed',
            duration,
            call_sid: call.parameters?.CallSid || undefined
          });
        }
        
        set({ 
          call: null, 
          status: 'Ready', 
          callStartTime: null, 
          currentPhoneNumber: null 
        });
      });

      call.on('cancel', () => {
        console.log('Call canceled');
        const { currentPhoneNumber } = get();
        
        if (currentPhoneNumber) {
          saveCallToDatabase({
            phone_number: currentPhoneNumber,
            direction: 'outgoing',
            status: 'no-answer',
            duration: 0,
            call_sid: call.parameters?.CallSid || undefined
          });
        }
        
        set({ 
          call: null, 
          status: 'Ready', 
          callStartTime: null, 
          currentPhoneNumber: null 
        });
      });

      call.on('error', (error) => {
        console.error('Call Error:', error);
        toast.error(error.message);
        const { currentPhoneNumber } = get();
        
        if (currentPhoneNumber) {
          saveCallToDatabase({
            phone_number: currentPhoneNumber,
            direction: 'outgoing',
            status: 'failed',
            duration: 0,
            call_sid: call.parameters?.CallSid || undefined
          });
        }
        
        set({ 
          call: null, 
          status: 'Error', 
          callStartTime: null, 
          currentPhoneNumber: null 
        });
      });
    } catch (error: any) {
      console.error('Error making call:', error);
      toast.error(error.message);
    }
  },
  endCall: () => {
    const { call, callStartTime, currentPhoneNumber } = get();
    if (call) {
      call.disconnect();
      
      // Save call if it was manually ended
      if (currentPhoneNumber && callStartTime) {
        const duration = Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000);
        saveCallToDatabase({
          phone_number: currentPhoneNumber,
          direction: 'outgoing',
          status: 'completed',
          duration,
          call_sid: call.parameters?.CallSid || undefined
        });
      }
    }
    set({ 
      call: null, 
      status: 'Ready', 
      callStartTime: null, 
      currentPhoneNumber: null 
    });
  },
  toggleMute: () => {
    const { call, isMuted } = get();
    if (call) {
      call.mute(!isMuted);
      set({ isMuted: !isMuted });
    }
  },
  acceptCall: () => {
    const { call } = get();
    if (call) {
      call.accept();
    }
  },
  rejectCall: () => {
    const { call } = get();
    if (call) {
      call.reject();
      set({ call: null, status: 'Ready' });
    }
  },
  initTwilio: async () => {
    try {
      console.log('Fetching Twilio access token...');
      const response = await fetch('/api/token');

      if (!response.ok) {
        console.warn('Twilio token request failed, disabling calling:', response.status, response.statusText);
        set({ status: 'Twilio disabled' });
        return;
      }

      const data = await response.json();
      console.log('Twilio token response:', data);

      if (!data.token) {
        console.warn('No Twilio token received from server, disabling calling');
        set({ status: 'Twilio disabled' });
        return;
      }

      console.log('Initializing Twilio device...');
      const device = initializeTwilio(data.token);
      set({ device, status: 'Connecting...' });

      device.on('registered', () => {
        console.log('Device registered successfully');
        set({ status: 'Ready' });
      });

      device.on('ready', () => {
        console.log('Device ready');
        set({ status: 'Ready' });
      });

      device.on('offline', () => {
        console.log('Device offline');
        set({ status: 'Offline' });
      });

      device.on('unregistered', () => {
        console.log('Device unregistered');
        set({ status: 'Disconnected' });
      });

      device.on('incoming', (call) => {
        console.log('Incoming call received in hook:', call);
        const incomingNumber = call.parameters?.From || 'Unknown';
        set({
          call,
          status: 'Incoming...',
          currentPhoneNumber: incomingNumber,
          callStartTime: null,
        });

        // Set up call event listeners for incoming calls
        call.on('accept', () => {
          console.log('Incoming call accepted');
          set({ status: 'In progress', callStartTime: new Date() });
        });

        call.on('disconnect', () => {
          console.log('Incoming call disconnected');
          const { callStartTime, currentPhoneNumber } = get();

          // Calculate duration and save call
          const duration = callStartTime
            ? Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000)
            : 0;

          if (currentPhoneNumber) {
            saveCallToDatabase({
              phone_number: currentPhoneNumber,
              direction: 'incoming',
              status: 'completed',
              duration,
              call_sid: call.parameters?.CallSid || undefined,
            });
          }

          set({
            call: null,
            status: 'Ready',
            callStartTime: null,
            currentPhoneNumber: null,
          });
        });

        call.on('cancel', () => {
          console.log('Incoming call canceled');
          const { currentPhoneNumber } = get();

          if (currentPhoneNumber) {
            saveCallToDatabase({
              phone_number: currentPhoneNumber,
              direction: 'incoming',
              status: 'missed',
              duration: 0,
              call_sid: call.parameters?.CallSid || undefined,
            });
          }

          set({
            call: null,
            status: 'Ready',
            callStartTime: null,
            currentPhoneNumber: null,
          });
        });

        call.on('reject', () => {
          console.log('Incoming call rejected');
          const { currentPhoneNumber } = get();

          if (currentPhoneNumber) {
            saveCallToDatabase({
              phone_number: currentPhoneNumber,
              direction: 'incoming',
              status: 'missed',
              duration: 0,
              call_sid: call.parameters?.CallSid || undefined,
            });
          }

          set({
            call: null,
            status: 'Ready',
            callStartTime: null,
            currentPhoneNumber: null,
          });
        });

        call.on('error', (error: any) => {
          console.error('Incoming Call Error:', error);
          toast.error(error.message);
          const { currentPhoneNumber } = get();

          if (currentPhoneNumber) {
            saveCallToDatabase({
              phone_number: currentPhoneNumber,
              direction: 'incoming',
              status: 'failed',
              duration: 0,
              call_sid: call.parameters?.CallSid || undefined,
            });
          }

          set({
            call: null,
            status: 'Error',
            callStartTime: null,
            currentPhoneNumber: null,
          });
        });
      });

      device.on('error', (error) => {
        console.error('Device error:', error);
        toast.error(`Device error: ${error.message}`);
        set({ status: 'Error' });
      });
    } catch (error) {
      console.error('Error initializing Twilio, disabling calling:', error);
      // Do NOT spam the user with errors if Twilio isn't configured
      set({ status: 'Twilio disabled' });
    }
  },
}));
