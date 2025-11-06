"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LocateFixed, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Coordinates = {
  lat: number;
  lng: number;
};

export function LocationTracker() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">Geolocation Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please ensure you have enabled location permissions for this site in your browser settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!coords) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-36" />
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LocateFixed className="h-5 w-5 text-accent" />
            Current Position
          </CardTitle>
          <CardDescription>
            Your real-time geographic coordinates. Updates every 5 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background/70">
            <p className="text-sm text-muted-foreground">Latitude</p>
            <p className="text-2xl font-semibold tracking-tighter">{coords.lat.toFixed(6)}</p>
          </div>
          <div className="rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background/70">
            <p className="text-sm text-muted-foreground">Longitude</p>
            <p className="text-2xl font-semibold tracking-tighter">{coords.lng.toFixed(6)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
