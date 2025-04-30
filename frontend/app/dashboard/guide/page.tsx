export default function GuidePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Plant Care Guide</h1>
      <p className="text-muted-foreground mb-8">Learn how to take care of your plants with our comprehensive guides.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="h-48 rounded-t-lg bg-muted"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold">Plant Care Guide {i + 1}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Learn everything about caring for your plants, from watering to fertilizing.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
