"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LocateFixed, AlertCircle, Edit, Search, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { geocode } from '@/ai/flows/geocode-flow';
import { useToast } from '@/hooks/use-toast';

type Coordinates = {
  lat: number;
  lng: number;
};

export function LocationTracker() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [manualCoords, setManualCoords] = useState<Coordinates | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("live");
  const [isGeocoding, startGeocoding] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab !== 'live') {
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoords(newCoords);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setCoords(null);
        }
      );
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 5000);

    return () => clearInterval(intervalId);
  }, [activeTab]);
  
  const handleGeocode = () => {
    if (!manualLocation) return;
    startGeocoding(async () => {
      try {
        const result = await geocode({ location: manualLocation });
        if (result) {
          setManualCoords(result);
        }
      } catch (e) {
        console.error(e);
        toast({
          variant: 'destructive',
          title: 'Geocoding Error',
          description: 'Could not find coordinates for the specified location.',
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGeocode();
    }
  };
  
  const displayCoords = activeTab === 'live' ? coords : manualCoords;

  const renderError = () => (
    <Card className="border-destructive/50 bg-destructive/10">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <AlertCircle className="h-6 w-6 text-destructive" />
        <CardTitle className="text-destructive">Geolocation Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please ensure you have enabled location permissions for this site. Alternatively, you can enter your coordinates manually.
        </p>
      </CardContent>
    </Card>
  );

  const renderSkeleton = () => (
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
    </div>
  );

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">
            <LocateFixed className="mr-2 h-4 w-4" />
            Live Location
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Edit className="mr-2 h-4 w-4" />
            Manual Input
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live">
          {error && renderError()}
          {!error && !coords && renderSkeleton()}
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Location</CardTitle>
              <CardDescription>Enter a city or address to find its coordinates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., Paris, France"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isGeocoding}
                  />
                  <Button onClick={handleGeocode} disabled={isGeocoding}>
                    {isGeocoding ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Search />
                    )}
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {displayCoords ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LocateFixed className="h-5 w-5 text-accent" />
              Current Position
            </CardTitle>
            <CardDescription>
              {activeTab === 'live'
                ? "Your real-time geographic coordinates. Updates every 5 seconds."
                : `Coordinates for ${manualLocation || 'the entered location'}.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background/70">
              <p className="text-sm text-muted-foreground">Latitude</p>
              <p className="text-2xl font-semibold tracking-tighter">{typeof displayCoords.lat === 'number' ? displayCoords.lat.toFixed(6) : ''}</p>
            </div>
            <div className="rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background/70">
              <p className="text-sm text-muted-foreground">Longitude</p>
              <p className="text-2xl font-semibold tracking-tighter">{typeof displayCoords.lng === 'number' ? displayCoords.lng.toFixed(6) : ''}</p>
            </div>
          </CardContent>
        </Card>
      ) : (activeTab === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LocateFixed className="h-5 w-5 text-accent" />
                Current Position
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Enter a location above and click search to see its coordinates.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
