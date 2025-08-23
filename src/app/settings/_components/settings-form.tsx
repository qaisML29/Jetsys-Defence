'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { AppSettings } from '@/types';
import { saveSettings } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Loader2 } from 'lucide-react';

interface SettingsFormProps {
  currentSettings: AppSettings;
}

export function SettingsForm({ currentSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const [phoneNumbers, setPhoneNumbers] = useState(currentSettings.phoneNumbers);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim() && !phoneNumbers.includes(newPhoneNumber.trim())) {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber.trim()]);
      setNewPhoneNumber('');
    }
  };

  const handleRemovePhoneNumber = (numToRemove: string) => {
    setPhoneNumbers(phoneNumbers.filter(num => num !== numToRemove));
  };

  const handleSave = async () => {
    setIsPending(true);
    const result = await saveSettings({ phoneNumbers });
    if (result.type === 'success') {
      toast({
        title: 'Success!',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Alert Phone Numbers</Label>
        <div className="space-y-2 mt-2">
          {phoneNumbers.map((num, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={num} readOnly className="bg-muted" />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemovePhoneNumber(num)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-grow space-y-2">
          <Label htmlFor="new-phone">Add New Number</Label>
          <Input
            id="new-phone"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            placeholder="+15551234567"
          />
        </div>
        <Button variant="outline" onClick={handleAddPhoneNumber} className="h-10">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      <Button onClick={handleSave} disabled={isPending} className="bg-accent hover:bg-accent/90">
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Settings
      </Button>
    </div>
  );
}
