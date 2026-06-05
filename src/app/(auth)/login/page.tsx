'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Building2, Lock, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { storeAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<{ access_token: string; user: any }>('/auth/login', {
        email,
        password,
      });
      storeAuth(response.access_token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-low flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-sidebar rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-headline-md text-on-surface font-bold">Mini ERP</h1>
          <p className="text-label-md text-on-surface-variant tracking-widest uppercase mt-1">
            Enterprise Manager
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-modal p-8">
          <h2 className="text-headline-sm text-on-surface mb-1">Sign In</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-body-md font-medium text-on-surface">Password</label>
                <button type="button" className="text-label-md text-secondary hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2 rounded border border-outline-variant bg-surface-lowest text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant accent-secondary"
              />
              <span className="text-body-md text-on-surface">Keep me signed in for 30 days</span>
            </label>

            {error && (
              <div className="py-2.5 px-3 rounded-lg bg-red-50 border border-red-200 text-body-md text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Sign In to Dashboard →
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-outline-variant text-center">
            <p className="text-body-md text-on-surface-variant">
              Don't have an account?{' '}
              <span className="text-secondary font-medium cursor-pointer hover:underline">
                Create Account
              </span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-label-md text-outline">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              SSL SECURE
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              ENCRYPTED DATA
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-label-md text-on-surface-variant">
          <button className="hover:text-on-surface transition-colors">Privacy Policy</button>
          <button className="hover:text-on-surface transition-colors">Terms of Service</button>
          <button className="hover:text-on-surface transition-colors">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
