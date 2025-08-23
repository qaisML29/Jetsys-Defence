'use client';

import { useActionState, useState, useEffect } from 'react';
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

const initialState = {
  type: null,
  message: '',
  phoneNumbers: [] as string[],
};

export function SettingsForm({ currentSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveSettings, initialState);
  const [phoneNumbers, setPhoneNumbers] = useState(currentSettings.phoneNumbers || []);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  
  const { pending } = useFormStatus();

   useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
       if(state.phoneNumbers) {
        setPhoneNumbers(state.phoneNumbers);
       }
    } else if (state.type === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleAddPhoneNumber = () => {
    const trimmedNumber = newPhoneNumber.trim();
    if (trimmedNumber && !phoneNumbers.includes(trimmedNumber)) {
      setPhoneNumbers([...phoneNumbers, trimmedNumber]);
      setNewPhoneNumber('');
    }
  };

  const handleRemovePhoneNumber = (numToRemove: string) => {
    setPhoneNumbers(phoneNumbers.filter(num => num !== numToRemove));
  };
  
  // Wrapper action to include the current phone numbers list
  const wrappedFormAction = (formData: FormData) => {
    formData.set('phoneNumbers', JSON.stringify(phoneNumbers));
    formAction(formData);
  };

  return (
    <form action={wrappedFormAction} className="space-y-6">
      <div>
        <Label>Alert Phone Numbers</Label>
        <div className="space-y-2 mt-2">
          {phoneNumbers.map((num, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={num} readOnly className="bg-muted" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemovePhoneNumber(num)}
                disabled={pending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
           {phoneNumbers.length === 0 && (
            <p className="text-sm text-muted-foreground">No phone numbers added yet.</p>
          )}
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
            disabled={pending}
          />
        </div>
        <Button type="button" variant="outline" onClick={handleAddPhoneNumber} className="h-10" disabled={pending}>
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90">
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Settings
      </Button>
    </form>
  );
}
