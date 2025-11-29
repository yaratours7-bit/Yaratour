'use client';
import Image from 'next/image';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  const handleSignIn = async () => {
    debugger;
    console.log('Signing in with:', { email, password });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // Redirect or update UI on successful sign-in
      window.location.href = '/';
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // Redirect or show a message to check email for confirmation
      alert('Sign up successful! Please check your email for a confirmation link.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8">
        <Image
          src="/yara-crm-logo.png"
          alt="Yara CRM Logo"
          width={224}
          height={68}
        />
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {isSigningIn ? 'Sign In' : 'Sign Up'}
        </h2>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button onClick={isSigningIn ? handleSignIn : handleSignUp} className="w-full">
          {isSigningIn ? 'Sign In' : 'Sign Up'}
        </Button>
        
      </div>
    </div>
  );
}
