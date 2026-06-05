'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { getStoredUser } from '@/lib/auth';

export default function SettingsPage() {
  const user = getStoredUser();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-headline-lg text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant mt-1">Manage your account and application preferences.</p>
      </div>

      <Card>
        <h2 className="text-headline-sm text-on-surface mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <Avatar name={user?.name ?? 'Admin'} size="lg" />
          <div>
            <p className="text-body-md font-semibold text-on-surface">{user?.name}</p>
            <p className="text-body-md text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={user?.name} placeholder="Your name" />
          <Input label="Email Address" type="email" defaultValue={user?.email} placeholder="email@company.com" />
        </div>
      </Card>

      <Card>
        <h2 className="text-headline-sm text-on-surface mb-5">Security</h2>
        <div className="flex flex-col gap-4">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-headline-sm text-on-surface mb-5">Company Information</h2>
        <div className="flex flex-col gap-4">
          <Input label="Company Name" placeholder="Acme Corp" />
          <Input label="Business Address" placeholder="123 Main St, City, State" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 (555) 000-0000" />
            <Input label="Website" placeholder="https://yourcompany.com" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="ghost">Discard Changes</Button>
        <Button onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
