"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"
import { usePlants } from "@/context/plant-context"
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

export function WateringSchedule() {
  const { plants, waterPlant } = usePlants()
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)
  const [isWaterDialogOpen, setIsWaterDialogOpen] = useState(false)
  const [wateringNotes, setWateringNotes] = useState("")

  // Sort plants by next watering date
  const sortedPlants = [...plants].sort(
    (a, b) => new Date(a.nextWatering).getTime() - new Date(b.nextWatering).getTime(),
  )

  // Get only the next 5 plants that need watering
  const upcomingWaterings = sortedPlants.slice(0, 5)

  const handleWaterClick = (plantId: string) => {
    setSelectedPlantId(plantId)
    setIsWaterDialogOpen(true)
  }

  const handleWaterPlant = () => {
    if (selectedPlantId) {
      waterPlant(selectedPlantId, wateringNotes)
      setWateringNotes("")
      setIsWaterDialogOpen(false)
      setSelectedPlantId(null)
    }
  }

  const selectedPlant = selectedPlantId ? plants.find((p) => p.id === selectedPlantId) : null

  return (
    <>
      <Table>
        <TableHeader className="bg-leaf-50/50">
          <TableRow className="hover:bg-leaf-50/80 border-leaf-100">
            <TableHead className="text-leaf-700">Plant</TableHead>
            <TableHead className="text-leaf-700">Location</TableHead>
            <TableHead className="text-leaf-700">Date</TableHead>
            <TableHead className="text-right text-leaf-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingWaterings.map((plant) => {
            const wateringDate = new Date(plant.nextWatering)
            const today = new Date()
            const isOverdue = wateringDate < today
            const isToday = wateringDate.toDateString() === today.toDateString()

            return (
              <TableRow key={plant.id} className="hover:bg-leaf-50/50 border-leaf-100">
                <TableCell className="font-medium text-leaf-800">{plant.name}</TableCell>
                <TableCell className="text-leaf-700">{plant.location}</TableCell>
                <TableCell>
                  <span className={isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-leaf-700"}>
                    {new Date(plant.nextWatering).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-leaf-200 text-leaf-700 hover:bg-leaf-50 hover:text-leaf-800"
                    onClick={() => handleWaterClick(plant.id)}
                  >
                    <Droplet className="h-3.5 w-3.5 text-blue-500" />
                    <span>Water</span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={isWaterDialogOpen} onOpenChange={setIsWaterDialogOpen}>
        <DialogContent className="bg-white border-leaf-200">
          <DialogHeader>
            <DialogTitle className="text-leaf-800 flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Water {selectedPlant?.name}
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
