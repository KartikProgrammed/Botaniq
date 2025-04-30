"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplet, Sun, Leaf } from "lucide-react"
import { usePlants, type Plant } from "@/context/plant-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React from "react"

interface PlantCardProps {
  plant: Plant
}

export function PlantCard({ plant }: PlantCardProps) {
  const { waterPlant } = usePlants()
  const [isWaterDialogOpen, setIsWaterDialogOpen] = useState(false)
  const [wateringNotes, setWateringNotes] = useState("")

  // Calculate days until next watering - memoize this calculation
  const daysUntilWatering = React.useMemo(() => {
    const today = new Date()
    const nextWatering = new Date(plant.nextWatering)
    return Math.ceil((nextWatering.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [plant.nextWatering])

  // Determine health status color
  const healthColor =
    {
      Excellent: "text-leaf-500",
      Good: "text-leaf-400",
      "Needs Attention": "text-amber-500",
      Critical: "text-red-500",
    }[plant.health] || "text-gray-400"

  const healthBgColor =
    {
      Excellent: "bg-leaf-500",
      Good: "bg-leaf-400",
      "Needs Attention": "bg-amber-500",
      Critical: "bg-red-500",
    }[plant.health] || "bg-gray-400"

  const handleWaterPlant = () => {
    waterPlant(plant.id, wateringNotes)
    setWateringNotes("")
    setIsWaterDialogOpen(false)
  }

  return (
    <>
      <Card className="overflow-hidden leaf-card transition-all duration-300 hover:shadow-md group">
        <div className="relative">
          <div className="h-48 w-full relative">
            <Image
              src={plant.image || "/placeholder.svg"}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                plant.health === "Critical"
                  ? "destructive"
                  : plant.health === "Needs Attention"
                    ? "default"
                    : "secondary"
              }
              className={
                plant.health === "Excellent" || plant.health === "Good"
                  ? "bg-leaf-100 text-leaf-700 hover:bg-leaf-200"
                  : ""
              }
            >
              {plant.health}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <CardContent className="p-4 relative">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold truncate text-leaf-800">{plant.name}</h3>
            <div className={`h-2 w-2 rounded-full ${healthBgColor}`} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{plant.location}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span className="text-leaf-700">{plant.waterNeeds}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sun className="h-4 w-4 text-amber-500" />
              <span className="text-leaf-700">{plant.lightNeeds}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between plant-footer p-4">
          <div className="text-sm">
            {daysUntilWatering <= 0 ? (
              <span className="font-medium text-red-500">Water today!</span>
            ) : daysUntilWatering === 1 ? (
              <span className="font-medium text-amber-500">Water tomorrow</span>
            ) : (
              <span className="text-leaf-700">Water in {daysUntilWatering} days</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWaterDialogOpen(true)}
              className="h-8 border-leaf-200 text-leaf-700 hover:bg-leaf-50 hover:text-leaf-800"
            >
              <Droplet className="h-3.5 w-3.5 mr-1 text-blue-500" />
              Water
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 text-leaf-700 hover:bg-leaf-50 hover:text-leaf-800"
            >
              <Link href={`/dashboard/plants/${plant.id}`}>
                <Leaf className="h-3.5 w-3.5 mr-1 text-leaf-500" />
                Details
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isWaterDialogOpen} onOpenChange={setIsWaterDialogOpen}>
        <DialogContent className="bg-white border-leaf-200">
          <DialogHeader>
            <DialogTitle className="text-leaf-800 flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Water {plant.name}
            </DialogTitle>
            <DialogDescription>
              Record that you've watered this plant today. Add any notes about the watering.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-leaf-700">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="e.g., Soil was very dry, gave extra water"
                value={wateringNotes}
                onChange={(e) => setWateringNotes(e.target.value)}
                className="border-leaf-200 focus-visible:ring-leaf-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWaterDialogOpen(false)}
              className="border-leaf-200 text-leaf-700 hover:bg-leaf-50"
            >
              Cancel
            </Button>
            <Button onClick={handleWaterPlant} className="bg-leaf-600 hover:bg-leaf-700 text-white">
              Confirm Watering
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
