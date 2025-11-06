"use client";

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface MapViewProps {
  lat: number;
  lng: number;
}

export function MapView({ lat, lng }: MapViewProps) {
  const position = { lat, lng };

  if (!API_KEY) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">Action Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To display the map, you need to provide a Google Maps API key.
          </p>
          <div className="mt-4 text-sm space-y-2">
            <p className="text-muted-foreground">
              1. Create a <code className="font-mono bg-muted text-muted-foreground p-1 rounded-md">.env.local</code> file in your project's root directory.
            </p>
            <p className="text-muted-foreground">
              2. Add your API key to the file:
            </p>
          </div>
          <pre className="mt-2 p-3 bg-background rounded-md text-sm overflow-x-auto">
            <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE</code>
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            3. After adding the key, you must restart your development server.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border transition-all duration-500">
        <Map
          center={position}
          zoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="geotracker-map-dark"
          styles={[
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }],
            },
          ]}
        >
          <Marker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
}
