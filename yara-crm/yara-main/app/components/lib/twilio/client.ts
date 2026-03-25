import { Device } from '@twilio/voice-sdk';

let device: Device | null = null;

export const initializeTwilio = (token: string) => {
  device = new Device(token);

  device.on('error', (error) => {
    console.error('Twilio Device Error:', error);
  });

  device.on('ready', () => {
    console.log('Twilio Device is ready');
  });

  device.on('offline', () => {
    console.log('Twilio Device is offline');
  });

  device.on('registered', () => {
    console.log('Twilio Device is registered');
  });

  device.on('unregistered', () => {
    console.log('Twilio Device is unregistered');
  });

  device.on('incoming', (call) => {
    console.log('Incoming call received:', call);
    // The call will be handled by the useCall hook
  });

  // Register the device to start the connection process
  console.log('Registering Twilio device...');
  device.register();

  return device;
};

export const makeCall = (params: { To: string }) => {
  if (!device) {
    throw new Error('Twilio not initialized');
  }
  
  console.log('Device state:', device.state);
  console.log('Making call with params:', params);
  
  // Ensure device is ready before making call
  if (device.state !== 'registered') {
    throw new Error('Device not ready. Current state: ' + device.state);
  }
  
  return device.connect({ params });
};

export const hangUp = () => {
  if (device) {
    device.disconnectAll();
  }
};
