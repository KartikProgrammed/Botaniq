"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplet, Sun, Filter, ArrowUpDown, Search, Calendar, Award, MapPin } from "lucide-react"
import { usePlants } from "@/context/plant-context"
import { LeafIcon } from "@/components/leaf-icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  const { plants, waterPlant } = usePlants()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Calculate user stats
  const totalPlants = plants.length
  const healthyPlants = plants.filter((p) => p.health === "Good" || p.health === "Excellent").length
  const oldestPlant = plants.reduce((oldest, current) => {
    return new Date(current.acquiredDate) < new Date(oldest.acquiredDate) ? current : oldest
  }, plants[0])

  // Filter and sort plants
  const filteredPlants = plants
    .filter((plant) => {
      // Apply search filter
      if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Apply type filter
      if (filterType !== "all" && plant.type !== filterType) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "location":
          comparison = a.location.localeCompare(b.location)
          break
        case "health":
          comparison = a.health.localeCompare(b.health)
          break
        case "acquired":
          comparison = new Date(a.acquiredDate).getTime() - new Date(b.acquiredDate).getTime()
          break
        case "watering":
          comparison = new Date(a.nextWatering).getTime() - new Date(b.nextWatering).getTime()
          break
        default:
          comparison = a.name.localeCompare(b.name)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const handleQuickWater = (plantId: string) => {
    waterPlant(plantId)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 relative">
      <LeafIcon variant="large" position="top-right" className="opacity-5" />

      <h1 className="text-3xl font-bold mb-2 text-leaf-800 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-leaf-600" />
        Profile
      </h1>
      <p className="text-muted-foreground mb-8">Manage your account settings and view your plant collection.</p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 bg-leaf-100/50 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="plants"
            className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
          >
            My Plants
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-white data-[state=active]:text-leaf-800 data-[state=active]:shadow-sm"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="leaf-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-leaf-800">Profile Overview</CardTitle>
                <CardDescription>Your plant care journey at a glance</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-leaf-200">
                    <Image src="/placeholder.svg?height=80&width=80" alt="Profile" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-leaf-800">Jane Doe</h3>
                    <p className="text-muted-foreground">Plant Enthusiast</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge className="bg-leaf-100 text-leaf-700 hover:bg-leaf-200">
                        <Award className="h-3 w-3 mr-1" />
                        Green Thumb
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="flex flex-col items-center justify-center p-3 bg-leaf-50 rounded-lg">
                    <span className="text-2xl font-bold text-leaf-700">{totalPlants}</span>
                    <span className="text-xs text-muted-foreground">Total Plants</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-leaf-50 rounded-lg">
                    <span className="text-2xl font-bold text-leaf-700">{healthyPlants}</span>
                    <span className="text-xs text-muted-foreground">Healthy Plants</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-leaf-50 rounded-lg">
                    <span className="text-2xl font-bold text-leaf-700">
                      {Math.floor((healthyPlants / totalPlants) * 100)}%
                    </span>
                    <span className="text-xs text-muted-foreground">Success Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="leaf-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-leaf-800">Plant Care Stats</CardTitle>
                <CardDescription>Your plant care activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-leaf-700">Watering Consistency</span>
                    </div>
                    <span className="text-sm font-medium text-leaf-700">85%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-leaf-700">Light Management</span>
                    </div>
                    <span className="text-sm font-medium text-leaf-700">70%</span>
                  </div>
                  <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-leaf-600" />
                      <span className="text-sm font-medium text-leaf-700">Overall Plant Health</span>
                    </div>
                    <span className="text-sm font-medium text-leaf-700">90%</span>
                  </div>
                  <div className="h-2 w-full bg-leaf-100 rounded-full overflow-hidden">
                    <div className="h-full bg-leaf-600 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                {oldestPlant && (
                  <div className="pt-4 border-t border-leaf-100">
                    <h4 className="text-sm font-medium text-leaf-700 mb-2">Longest Living Plant</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-leaf-50 flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-leaf-600" />
                      </div>
                      <div>
                        <p className="font-medium text-leaf-800">{oldestPlant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Since {new Date(oldestPlant.acquiredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plants">
          <Card className="leaf-card">
            <CardHeader>
              <CardTitle className="text-leaf-800 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-leaf-600" />
                My Plant Collection
              </CardTitle>
              <CardDescription>Manage and monitor all your plants in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search plants..."
                    className="pl-8 border-leaf-200 focus-visible:ring-leaf-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px] border-leaf-200 focus:ring-leaf-500">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-leaf-600" />
                        <SelectValue placeholder="Filter by type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-leaf-200">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Indoor">Indoor</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                      <SelectItem value="Indoor/Outdoor">Indoor/Outdoor</SelectItem>
                    </SelectContent>
                  </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-leaf-200 text-leaf-700 hover:bg-leaf-50">
                        <ArrowUpDown className="h-4 w-4 mr-2 text-leaf-600" />
                        Sort
                        {sortBy !== "name" && (
                          <Badge className="ml-2 bg-leaf-100 text-leaf-700 hover:bg-leaf-200">{sortBy}</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-leaf-200">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy("name")
                          if (sortBy === "name") toggleSortDirection()
                        }}
                      >
                        Name
                        {sortBy === "name" && <ArrowUpDown className="h-4 w-4 text-leaf-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy("location")
                          if (sortBy === "location") toggleSortDirection()
                        }}
                      >
                        Location
                        {sortBy === "location" && <ArrowUpDown className="h-4 w-4 text-leaf-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy("health")
                          if (sortBy === "health") toggleSortDirection()
                        }}
                      >
                        Health Status
                        {sortBy === "health" && <ArrowUpDown className="h-4 w-4 text-leaf-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy("acquired")
                          if (sortBy === "acquired") toggleSortDirection()
                        }}
                      >
                        Date Acquired
                        {sortBy === "acquired" && <ArrowUpDown className="h-4 w-4 text-leaf-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy("watering")
                          if (sortBy === "watering") toggleSortDirection()
                        }}
                      >
                        Next Watering
                        {sortBy === "watering" && <ArrowUpDown className="h-4 w-4 text-leaf-600" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="rounded-md border border-leaf-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-leaf-50/50">
                    <TableRow className="hover:bg-leaf-50/80 border-leaf-100">
                      <TableHead className="text-leaf-700">Plant</TableHead>
                      <TableHead className="text-leaf-700">Location</TableHead>
                      <TableHead className="text-leaf-700">Health</TableHead>
                      <TableHead className="text-leaf-700">Type</TableHead>
                      <TableHead className="text-leaf-700">Next Watering</TableHead>
                      <TableHead className="text-leaf-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlants.length > 0 ? (
                      filteredPlants.map((plant) => {
                        const wateringDate = new Date(plant.nextWatering)
                        const today = new Date()
                        const isOverdue = wateringDate < today
                        const isToday = wateringDate.toDateString() === today.toDateString()

                        return (
                          <TableRow key={plant.id} className="hover:bg-leaf-50/50 border-leaf-100">
                            <TableCell className="font-medium text-leaf-800">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-leaf-100 flex items-center justify-center">
                                  <Leaf className="h-4 w-4 text-leaf-600" />
                                </div>
                                {plant.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-leaf-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-leaf-500" />
                                {plant.location}
                              </div>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-leaf-700">{plant.type}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-leaf-500" />
                                <span
                                  className={isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-leaf-700"}
                                >
                                  {new Date(plant.nextWatering).toLocaleDateString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-leaf-200 text-leaf-700 hover:bg-leaf-50"
                                  onClick={() => handleQuickWater(plant.id)}
                                >
                                  <Droplet className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                  Water
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-leaf-700 hover:bg-leaf-50"
                                  asChild
                                >
                                  <a href={`/dashboard/plants/${plant.id}`}>
                                    <Leaf className="h-3.5 w-3.5 text-leaf-500 mr-1" />
                                    Details
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Leaf className="h-8 w-8 text-leaf-300 mb-2" />
                            <p>No plants found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="leaf-card">
            <CardHeader>
              <CardTitle className="text-leaf-800">Account Information</CardTitle>
              <CardDescription>Update your account details and personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-leaf-700">
                    First name
                  </Label>
                  <Input id="first-name" defaultValue="Jane" className="border-leaf-200 focus-visible:ring-leaf-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-leaf-700">
                    Last name
                  </Label>
                  <Input id="last-name" defaultValue="Doe" className="border-leaf-200 focus-visible:ring-leaf-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-leaf-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="jane.doe@example.com"
                  className="border-leaf-200 focus-visible:ring-leaf-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-leaf-600 hover:bg-leaf-700 text-white">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6 leaf-card">
            <CardHeader>
              <CardTitle className="text-leaf-800">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-leaf-700">
                  Current password
                </Label>
                <Input id="current-password" type="password" className="border-leaf-200 focus-visible:ring-leaf-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-leaf-700">
                  New password
                </Label>
                <Input id="new-password" type="password" className="border-leaf-200 focus-visible:ring-leaf-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-leaf-700">
                  Confirm password
                </Label>
                <Input id="confirm-password" type="password" className="border-leaf-200 focus-visible:ring-leaf-500" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-leaf-600 hover:bg-leaf-700 text-white">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="leaf-card">
            <CardHeader>
              <CardTitle className="text-leaf-800">App Preferences</CardTitle>
              <CardDescription>Customize your app experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Preference settings will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
