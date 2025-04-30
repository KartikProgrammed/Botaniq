"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Droplet,
  Sun,
  Thermometer,
  Calendar,
  Home,
  Edit,
  Trash2,
  Clock,
  Ruler,
  TreesIcon as Plant,
} from "lucide-react"
import { usePlants } from "@/context/plant-context"

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getPlantById, waterPlant, fertilizePlant, updatePlant, deletePlant } = usePlants()
  const [plant, setPlant] = useState(getPlantById(params.id))

  // Dialogs state
  const [isWaterDialogOpen, setIsWaterDialogOpen] = useState(false)
  const [isFertilizeDialogOpen, setIsFertilizeDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form state
  const [wateringNotes, setWateringNotes] = useState("")
  const [fertilizingNotes, setFertilizingNotes] = useState("")
  const [editFormData, setEditFormData] = useState({
    name: plant?.name || "",
    location: plant?.location || "",
    type: plant?.type || "Indoor",
    lightNeeds: plant?.lightNeeds || "Medium",
    waterNeeds: plant?.waterNeeds || "Medium",
    description: plant?.description || "",
  })

  // Refresh plant data when it changes
  useEffect(() => {
    const currentPlant = getPlantById(params.id)
    if (JSON.stringify(currentPlant) !== JSON.stringify(plant)) {
      setPlant(currentPlant)
    }
  }, [getPlantById, params.id, plant])

  // Redirect if plant not found
  useEffect(() => {
    if (!plant) {
      router.push("/dashboard")
    }
  }, [plant, router])

  if (!plant) {
    return <div>Loading...</div>
  }

  const handleWaterPlant = () => {
    waterPlant(plant.id, wateringNotes)
    setWateringNotes("")
    setIsWaterDialogOpen(false)
  }

  const handleFertilizePlant = () => {
    fertilizePlant(plant.id, fertilizingNotes)
    setFertilizingNotes("")
    setIsFertilizeDialogOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePlant(plant.id, editFormData)
    setIsEditDialogOpen(false)
  }

  const handleDeletePlant = () => {
    deletePlant(plant.id)
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Garden
          </Link>
        </Button>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{plant.name}</h1>
            <p className="text-muted-foreground">
              {plant.type} • Added on {new Date(plant.acquiredDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Plant
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant={
                    plant.health === "Critical"
                      ? "destructive"
                      : plant.health === "Needs Attention"
                        ? "default"
                        : "secondary"
                  }
                >
                  {plant.health}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="care">Care Guide</TabsTrigger>
                  <TabsTrigger value="history">Care History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <p>{plant.description || "No description available."}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Droplet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Water Needs</p>
                        <p className="text-sm text-muted-foreground">{plant.waterNeeds}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Sun className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Light Needs</p>
                        <p className="text-sm text-muted-foreground">{plant.lightNeeds}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Thermometer className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-sm text-muted-foreground">{plant.temperature || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{plant.location}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="care" className="space-y-4">
                  <p>{plant.careNotes || "No care notes available."}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Height:{" "}
                          <span className="font-normal text-muted-foreground">{plant.height || "Not specified"}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plant className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Pot Size:{" "}
                          <span className="font-normal text-muted-foreground">{plant.potSize || "Not specified"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Watering Frequency:{" "}
                          <span className="font-normal text-muted-foreground">
                            {plant.waterNeeds === "Low"
                              ? "Every 2 weeks"
                              : plant.waterNeeds === "Medium"
                                ? "Weekly"
                                : plant.waterNeeds === "High"
                                  ? "Every 2-3 days"
                                  : "When top 2-3 inches of soil are dry"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Fertilizing:{" "}
                          <span className="font-normal text-muted-foreground">
                            {plant.fertilizer || "Monthly during growing season"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {plant.commonIssues && plant.commonIssues.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Common Issues</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {plant.commonIssues.map((issue, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="history">
                  <div className="space-y-4">
                    {plant.careHistory && plant.careHistory.length > 0 ? (
                      plant.careHistory
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((entry, index) => (
                          <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              {entry.action === "Watered" ? (
                                <Droplet className="h-5 w-5 text-primary" />
                              ) : entry.action === "Fertilized" ? (
                                <Plant className="h-5 w-5 text-primary" />
                              ) : (
                                <Calendar className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{entry.action}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(entry.date).toLocaleDateString()}
                                </p>
                              </div>
                              {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground">No care history available.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Care Schedule</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Next Watering</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plant.nextWatering).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setIsWaterDialogOpen(true)}>
                    Water Now
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Plant className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Next Fertilizing</p>
                      <p className="text-sm text-muted-foreground">
                        {plant.nextFertilizing ? new Date(plant.nextFertilizing).toLocaleDateString() : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsFertilizeDialogOpen(true)}>
                    Fertilize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Growth Tracking</h2>
              <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Growth chart will appear here</p>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Add Measurement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-muted rounded-md"></div>
                <div className="aspect-square bg-muted rounded-md"></div>
                <div className="aspect-square bg-muted rounded-md"></div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Add Photo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Water Dialog */}
      <Dialog open={isWaterDialogOpen} onOpenChange={setIsWaterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Water {plant.name}</DialogTitle>
            <DialogDescription>
              Record that you've watered this plant today. Add any notes about the watering.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="water-notes">Notes (optional)</Label>
              <Textarea
                id="water-notes"
                placeholder="e.g., Soil was very dry, gave extra water"
                value={wateringNotes}
                onChange={(e) => setWateringNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWaterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWaterPlant}>Confirm Watering</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fertilize Dialog */}
      <Dialog open={isFertilizeDialogOpen} onOpenChange={setIsFertilizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fertilize {plant.name}</DialogTitle>
            <DialogDescription>
              Record that you've fertilized this plant today. Add any notes about the fertilizing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fertilize-notes">Notes (optional)</Label>
              <Textarea
                id="fertilize-notes"
                placeholder="e.g., Used half-strength fertilizer"
                value={fertilizingNotes}
                onChange={(e) => setFertilizingNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFertilizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFertilizePlant}>Confirm Fertilizing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {plant.name}</DialogTitle>
            <DialogDescription>Update the details of your plant.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plant Name</Label>
                  <Input id="name" name="name" value={editFormData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Plant Type</Label>
                  <Select value={editFormData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indoor">Indoor</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                      <SelectItem value="Indoor/Outdoor">Indoor/Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lightNeeds">Light Needs</Label>
                  <Select
                    value={editFormData.lightNeeds}
                    onValueChange={(value) => handleSelectChange("lightNeeds", value)}
                  >
                    <SelectTrigger id="lightNeeds">
                      <SelectValue placeholder="Select light needs" />
                    </SelectTrigger>
                    <SelectContent>
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
                <Label htmlFor="waterNeeds">Water Needs</Label>
                <Select
                  value={editFormData.waterNeeds}
                  onValueChange={(value) => handleSelectChange("waterNeeds", value)}
                >
                  <SelectTrigger id="waterNeeds">
                    <SelectValue placeholder="Select water needs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low (Every 2 weeks)</SelectItem>
                    <SelectItem value="Medium">Medium (Weekly)</SelectItem>
                    <SelectItem value="High">High (Every 2-3 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {plant.name}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlant}>
              Delete Plant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
