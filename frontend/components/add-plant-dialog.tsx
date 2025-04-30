"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePlants } from "@/context/plant-context"
import { Leaf, Droplet, Sun, MapPin } from "lucide-react"

interface AddPlantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPlantDialog({ open, onOpenChange }: AddPlantDialogProps) {
  const { addPlant } = usePlants()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "Indoor",
    lightNeeds: "Medium",
    waterNeeds: "Medium",
    description: "",
    image: "/images/monstera-deliciosa.webp", // Default image
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate initial watering date (today + days based on water needs)
    const today = new Date()
    let daysUntilNextWatering = 7 // Default

    if (formData.waterNeeds === "Low") {
      daysUntilNextWatering = 14
    } else if (formData.waterNeeds === "Medium") {
      daysUntilNextWatering = 7
    } else if (formData.waterNeeds === "High") {
      daysUntilNextWatering = 3
    }

    const nextWatering = new Date(today)
    nextWatering.setDate(today.getDate() + daysUntilNextWatering)

    // Calculate initial fertilizing date (today + 30 days)
    const nextFertilizing = new Date(today)
    nextFertilizing.setDate(today.getDate() + 30)

    addPlant({
      ...formData,
      health: "Good",
      acquiredDate: today.toISOString().split("T")[0],
      lastWatered: today.toISOString().split("T")[0],
      nextWatering: nextWatering.toISOString().split("T")[0],
      lastFertilized: today.toISOString().split("T")[0],
      nextFertilizing: nextFertilizing.toISOString().split("T")[0],
      careHistory: [
        {
          date: today.toISOString().split("T")[0],
          action: "Added to garden",
          notes: "Plant added to Botaniq",
        },
      ],
    })

    // Reset form and close dialog
    setFormData({
      name: "",
      location: "",
      type: "Indoor",
      lightNeeds: "Medium",
      waterNeeds: "Medium",
      description: "",
      image: "/images/monstera-deliciosa.webp",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-leaf-200">
        <DialogHeader>
          <DialogTitle className="text-leaf-800 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-leaf-600" />
            Add New Plant
          </DialogTitle>
          <DialogDescription>Enter the details of your new plant to add it to your garden.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-leaf-700 flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5 text-leaf-600" />
                  Plant Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Monstera Deliciosa"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-leaf-200 focus-visible:ring-leaf-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-leaf-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-leaf-600" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Living Room"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="border-leaf-200 focus-visible:ring-leaf-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-leaf-700">
                  Plant Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type" className="border-leaf-200 focus:ring-leaf-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-leaf-200">
                    <SelectItem value="Indoor">Indoor</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Indoor/Outdoor">Indoor/Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightNeeds" className="text-leaf-700 flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  Light Needs
                </Label>
                <Select value={formData.lightNeeds} onValueChange={(value) => handleSelectChange("lightNeeds", value)}>
                  <SelectTrigger id="lightNeeds" className="border-leaf-200 focus:ring-leaf-500">
                    <SelectValue placeholder="Select light needs" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-leaf-200">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Low to Medium">Low to Medium</SelectItem>
                    <SelectItem value="Medium to High">Medium to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterNeeds" className="text-leaf-700 flex items-center gap-1">
                <Droplet className="h-3.5 w-3.5 text-blue-500" />
                Water Needs
              </Label>
              <Select value={formData.waterNeeds} onValueChange={(value) => handleSelectChange("waterNeeds", value)}>
                <SelectTrigger id="waterNeeds" className="border-leaf-200 focus:ring-leaf-500">
                  <SelectValue placeholder="Select water needs" />
                </SelectTrigger>
                <SelectContent className="bg-white border-leaf-200">
                  <SelectItem value="Low">Low (Every 2 weeks)</SelectItem>
                  <SelectItem value="Medium">Medium (Weekly)</SelectItem>
                  <SelectItem value="High">High (Every 2-3 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-leaf-700">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add any notes or description about your plant"
                value={formData.description}
                onChange={handleInputChange}
                className="border-leaf-200 focus-visible:ring-leaf-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-leaf-600 hover:bg-leaf-700 text-white">
              <Leaf className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
