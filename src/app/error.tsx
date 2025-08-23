'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                <CardDescription>Something went wrong on our end.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    We've been notified of the issue. Please try again in a few moments.
                </p>
                <Button
                    onClick={() => reset()}
                    className="w-full bg-accent hover:bg-accent/90"
                >
                    Try again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
