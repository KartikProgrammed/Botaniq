"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flower, Droplet, AlertTriangle } from "lucide-react"
import { usePlants } from "@/context/plant-context"

export function PlantStats() {
  const { stats } = usePlants()

  return (
    <>
      <Card className="plant-stats-card">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-leaf-600">Total Plants</p>
            <p className="text-3xl font-bold text-leaf-800">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-leaf-100 flex items-center justify-center">
            <Flower className="h-6 w-6 text-leaf-600" />
          </div>
        </CardContent>
      </Card>
      <Card className="plant-stats-card">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-leaf-600">Need Watering</p>
            <p className="text-3xl font-bold text-leaf-800">{stats.needsWatering}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Droplet className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="plant-stats-card">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-leaf-600">Need Attention</p>
            <p className="text-3xl font-bold text-leaf-800">{stats.needsAttention}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
