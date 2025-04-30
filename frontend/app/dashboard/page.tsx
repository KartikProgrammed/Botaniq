"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlantCard } from "@/components/plant-card"
import { PlantStats } from "@/components/plant-stats"
import { WateringSchedule } from "@/components/watering-schedule"
import { Plus, Filter, SortDesc, Leaf, Flower2, Wand } from "lucide-react"
import { usePlants } from "@/context/plant-context"
import { useState } from "react"
import { AddPlantDialog } from "@/components/add-plant-dialog"
import IdentifyPlantButton from "./components/IdentifyPlantButton"
import IdentifyPlantModal from "./components/IdentifyPlantModal"

export default function DashboardPage() {
  const { plants } = usePlants()
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false)
  const [isIdentifyModalOpen, setIsIdentifyModalOpen] = useState(false)

  const openIdentifyModal = () => {
    setIsIdentifyModalOpen(true);
  };

  const closeIdentifyModal = () => {
    setIsIdentifyModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 relative">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-leaf-600" />
            <h1 className="text-3xl font-bold tracking-tight text-leaf-900">My Garden</h1>
          </div>
          <p className="text-muted-foreground ml-8">Manage and monitor your plants all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="w-full md:w-auto bg-leaf-600 hover:bg-leaf-700 text-white"
            onClick={() => setIsAddPlantOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Plant
          </Button>
          <IdentifyPlantButton onOpenModal={openIdentifyModal} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PlantStats />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-leaf-100/50 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
            >
              All Plants
            </TabsTrigger>
            <TabsTrigger
              value="indoor"
              className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
            >
              Indoor
            </TabsTrigger>
            <TabsTrigger
              value="outdoor"
              className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
            >
              Outdoor
            </TabsTrigger>
            <TabsTrigger
              value="needs-care"
              className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
            >
              Needs Care
            </TabsTrigger>
          </TabsList>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="sm" className="border-leaf-200 text-leaf-700 hover:bg-leaf-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-leaf-200 text-leaf-700 hover:bg-leaf-50">
              <SortDesc className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="indoor" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants
              .filter((plant) => plant.type.includes("Indoor"))
              .map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="outdoor" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants
              .filter((plant) => plant.type.includes("Outdoor"))
              .map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="needs-care" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants
              .filter(
                (plant) =>
                  plant.health === "Needs Attention" ||
                  plant.health === "Critical" ||
                  new Date(plant.nextWatering) <= new Date(),
              )
              .map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 leaf-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="h-5 w-5 text-leaf-600" />
              <h2 className="text-xl font-bold text-leaf-800">Upcoming Care Schedule</h2>
            </div>
            <WateringSchedule />
          </CardContent>
        </Card>
        <Card className="leaf-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-leaf-600" />
              <h2 className="text-xl font-bold text-leaf-800">Plant Care Tips</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-leaf-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-leaf-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-leaf-800">Water deeply but infrequently</p>
                  <p className="text-muted-foreground">This encourages roots to grow deeper and stronger.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-leaf-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-leaf-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-leaf-800">Rotate your plants regularly</p>
                  <p className="text-muted-foreground">This ensures even growth and prevents leaning.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-leaf-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-leaf-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-leaf-800">Clean leaves occasionally</p>
                  <p className="text-muted-foreground">Dust can block sunlight and reduce photosynthesis.</p>
                </div>
              </li>
            </ul>
            <Button variant="link" className="mt-4 px-0 text-leaf-700 hover:text-leaf-800">
              View all tips
            </Button>
          </CardContent>
        </Card>
      </div>

      <AddPlantDialog open={isAddPlantOpen} onOpenChange={setIsAddPlantOpen} />
      <IdentifyPlantModal isOpen={isIdentifyModalOpen} onClose={closeIdentifyModal} />
    </div>
  )
}