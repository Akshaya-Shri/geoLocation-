import { LocationTracker } from '@/components/geotracker/location-tracker';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            GeoTracker
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your real-time location dashboard.
          </p>
        </header>
        <LocationTracker />
      </div>
    </main>
  );
}
