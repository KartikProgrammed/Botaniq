"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define plant types
export interface Plant {
  id: string
  name: string
  image: string
  location: string
  lastWatered: string
  nextWatering: string
  health: string
  type: string
  lightNeeds: string
  waterNeeds: string
  acquiredDate: string
  description?: string
  careNotes?: string
  height?: string
  potSize?: string
  soilType?: string
  fertilizer?: string
  humidity?: string
  temperature?: string
  propagation?: string
  commonIssues?: string[]
  lastFertilized?: string
  nextFertilizing?: string
  careHistory?: CareHistoryEntry[]
}

export interface CareHistoryEntry {
  date: string
  action: string
  notes: string
}

// Sample plant data
const initialPlants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    image: "/images/monstera-deliciosa.webp", // Update this line
    location: "Living Room",
    lastWatered: "2023-04-01",
    nextWatering: "2023-04-08",
    lastFertilized: "2023-03-15",
    nextFertilizing: "2023-04-15",
    health: "Good",
    type: "Indoor",
    lightNeeds: "Medium",
    waterNeeds: "Medium",
    acquiredDate: "2023-01-15",
    description:
      "The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama.",
    careNotes: "Water when the top 2-3 inches of soil are dry. Likes bright, indirect light.",
    height: "2.5 feet",
    potSize: "10 inches",
    soilType: "Well-draining potting mix",
    fertilizer: "Balanced liquid fertilizer once a month during growing season",
    humidity: "Medium to high",
    temperature: "65-85°F (18-29°C)",
    propagation: "Stem cuttings with a node",
    commonIssues: [
      "Yellow leaves may indicate overwatering",
      "Brown leaf edges may indicate low humidity",
      "Lack of fenestration (holes) in leaves may indicate insufficient light",
    ],
    careHistory: [
      { date: "2023-04-01", action: "Watered", notes: "Soil was quite dry" },
      { date: "2023-03-15", action: "Fertilized", notes: "Used half-strength fertilizer" },
      { date: "2023-03-15", action: "Watered", notes: "" },
    ],
  },
  {
    id: "2",
    name: "Snake Plant",
    image: "/images/snake-plant.webp", // Update this line
    location: "Bedroom",
    lastWatered: "2023-04-03",
    nextWatering: "2023-04-17",
    lastFertilized: "2023-03-01",
    nextFertilizing: "2023-05-01",
    health: "Excellent",
    type: "Indoor",
    lightNeeds: "Low",
    waterNeeds: "Low",
    acquiredDate: "2022-11-20",
    careHistory: [
      { date: "2023-04-03", action: "Watered", notes: "" },
      { date: "2023-03-01", action: "Fertilized", notes: "" },
    ],
  },
  {
    id: "3",
    name: "Fiddle Leaf Fig",
    image: "/images/fiddle-leaf-fig.jpg", // Update this line
    location: "Study",
    lastWatered: "2023-03-25",
    nextWatering: "2023-04-02",
    lastFertilized: "2023-03-10",
    nextFertilizing: "2023-04-10",
    health: "Needs Attention",
    type: "Indoor",
    lightNeeds: "High",
    waterNeeds: "Medium",
    acquiredDate: "2023-02-05",
    careHistory: [
      { date: "2023-03-25", action: "Watered", notes: "" },
      { date: "2023-03-10", action: "Fertilized", notes: "" },
    ],
  },
  {
    id: "4",
    name: "Peace Lily",
    image: "/images/peace-lily.webp", // Update this line
    location: "Kitchen",
    lastWatered: "2023-04-04",
    nextWatering: "2023-04-11",
    lastFertilized: "2023-03-20",
    nextFertilizing: "2023-04-20",
    health: "Good",
    type: "Indoor",
    lightNeeds: "Low to Medium",
    waterNeeds: "Medium",
    acquiredDate: "2022-12-10",
    careHistory: [
      { date: "2023-04-04", action: "Watered", notes: "" },
      { date: "2023-03-20", action: "Fertilized", notes: "" },
    ],
  },
  {
    id: "5",
    name: "Pothos",
    image: "/images/monstera-deliciosa.webp", // Using monstera image as fallback
    location: "Office",
    lastWatered: "2023-04-01",
    nextWatering: "2023-04-15",
    lastFertilized: "2023-03-15",
    nextFertilizing: "2023-04-15",
    health: "Excellent",
    type: "Indoor",
    lightNeeds: "Low to Medium",
    waterNeeds: "Low",
    acquiredDate: "2023-03-01",
    careHistory: [
      { date: "2023-04-01", action: "Watered", notes: "" },
      { date: "2023-03-15", action: "Fertilized", notes: "" },
    ],
  },
  {
    id: "6",
    name: "Aloe Vera",
    image: "/images/aloe-vera.webp", // Update this line
    location: "Balcony",
    lastWatered: "2023-03-25",
    nextWatering: "2023-04-15",
    lastFertilized: "2023-03-01",
    nextFertilizing: "2023-05-01",
    health: "Good",
    type: "Indoor/Outdoor",
    lightNeeds: "High",
    waterNeeds: "Low",
    acquiredDate: "2022-10-15",
    careHistory: [
      { date: "2023-03-25", action: "Watered", notes: "" },
      { date: "2023-03-01", action: "Fertilized", notes: "" },
    ],
  },
]

interface PlantContextType {
  plants: Plant[]
  addPlant: (plant: Omit<Plant, "id">) => void
  updatePlant: (id: string, plant: Partial<Plant>) => void
  deletePlant: (id: string) => void
  waterPlant: (id: string, notes?: string) => void
  fertilizePlant: (id: string, notes?: string) => void
  updatePlantHealth: () => void
  getPlantById: (id: string) => Plant | undefined
  stats: {
    total: number
    needsWatering: number
    needsAttention: number
  }
}

const PlantContext = createContext<PlantContextType | undefined>(undefined)

export function PlantProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(() => {
    // In a real app, you would load from localStorage or an API
    if (typeof window !== "undefined") {
      const savedPlants = localStorage.getItem("plants")
      return savedPlants ? JSON.parse(savedPlants) : initialPlants
    }
    return initialPlants
  })

  // Calculate stats
  const stats = {
    total: plants.length,
    needsWatering: plants.filter((plant) => {
      const today = new Date()
      const nextWatering = new Date(plant.nextWatering)
      return nextWatering <= today
    }).length,
    needsAttention: plants.filter((plant) => plant.health === "Needs Attention" || plant.health === "Critical").length,
  }

  // Save plants to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("plants", JSON.stringify(plants))
    }
  }, [plants])

  // Add a new plant
  const addPlant = (plant: Omit<Plant, "id">) => {
    const newPlant: Plant = {
      ...plant,
      id: Date.now().toString(),
      careHistory: plant.careHistory || [],
    }
    setPlants((prev) => [...prev, newPlant])
  }

  // Update an existing plant
  const updatePlant = (id: string, updatedFields: Partial<Plant>) => {
    setPlants((prev) => prev.map((plant) => (plant.id === id ? { ...plant, ...updatedFields } : plant)))
  }

  // Delete a plant
  const deletePlant = (id: string) => {
    setPlants((prev) => prev.filter((plant) => plant.id !== id))
  }

  // Water a plant
  const waterPlant = (id: string, notes = "") => {
    const today = new Date()
    const plant = plants.find((p) => p.id === id)

    if (!plant) return

    // Calculate next watering date based on water needs
    let daysUntilNextWatering = 7 // Default
    if (plant.waterNeeds === "Low") {
      daysUntilNextWatering = 14
    } else if (plant.waterNeeds === "Medium") {
      daysUntilNextWatering = 7
    } else if (plant.waterNeeds === "High") {
      daysUntilNextWatering = 3
    }

    const nextWatering = new Date(today)
    nextWatering.setDate(today.getDate() + daysUntilNextWatering)

    // Add to care history
    const careHistoryEntry: CareHistoryEntry = {
      date: today.toISOString().split("T")[0],
      action: "Watered",
      notes,
    }

    updatePlant(id, {
      lastWatered: today.toISOString().split("T")[0],
      nextWatering: nextWatering.toISOString().split("T")[0],
      careHistory: [...(plant.careHistory || []), careHistoryEntry],
    })
  }

  // Fertilize a plant
  const fertilizePlant = (id: string, notes = "") => {
    const today = new Date()
    const plant = plants.find((p) => p.id === id)

    if (!plant) return

    // Calculate next fertilizing date (typically once a month)
    const nextFertilizing = new Date(today)
    nextFertilizing.setDate(today.getDate() + 30)

    // Add to care history
    const careHistoryEntry: CareHistoryEntry = {
      date: today.toISOString().split("T")[0],
      action: "Fertilized",
      notes,
    }

    updatePlant(id, {
      lastFertilized: today.toISOString().split("T")[0],
      nextFertilizing: nextFertilizing.toISOString().split("T")[0],
      careHistory: [...(plant.careHistory || []), careHistoryEntry],
    })
  }

  // Update plant health based on care status
  const updatePlantHealth = () => {
    const today = new Date()

    setPlants((prev) => {
      // Check if any plants need health updates
      const needsUpdate = prev.some((plant) => {
        const nextWatering = new Date(plant.nextWatering)
        const daysOverdue = Math.floor((today.getTime() - nextWatering.getTime()) / (1000 * 60 * 60 * 24))

        const newHealth = plant.health

        // If watering is overdue by more than 3 days, plant needs attention
        if (daysOverdue > 3 && plant.health === "Good") {
          return true
        }

        // If watering is overdue by more than 7 days, plant is in critical condition
        if (daysOverdue > 7 && plant.health !== "Critical") {
          return true
        }

        // If plant was recently watered and was previously in need of attention, improve health
        if (daysOverdue < 0 && (plant.health === "Needs Attention" || plant.health === "Critical")) {
          return true
        }

        return false
      })

      // Only update if needed
      if (!needsUpdate) {
        return prev
      }

      // Update plants that need health changes
      return prev.map((plant) => {
        const nextWatering = new Date(plant.nextWatering)
        const daysOverdue = Math.floor((today.getTime() - nextWatering.getTime()) / (1000 * 60 * 60 * 24))

        let newHealth = plant.health

        // If watering is overdue by more than 3 days, plant needs attention
        if (daysOverdue > 3 && plant.health === "Good") {
          newHealth = "Needs Attention"
        }

        // If watering is overdue by more than 7 days, plant is in critical condition
        if (daysOverdue > 7 && plant.health !== "Critical") {
          newHealth = "Critical"
        }

        // If plant was recently watered and was previously in need of attention, improve health
        if (daysOverdue < 0 && (plant.health === "Needs Attention" || plant.health === "Critical")) {
          newHealth = "Good"
        }

        return newHealth !== plant.health ? { ...plant, health: newHealth } : plant
      })
    })
  }

  // Get a plant by ID
  const getPlantById = (id: string) => {
    return plants.find((plant) => plant.id === id)
  }

  // Update plant health whenever plants change
  useEffect(() => {
    // Run once when component mounts
    updatePlantHealth()

    // Set up an interval to check plant health every hour
    const intervalId = setInterval(() => {
      updatePlantHealth()
    }, 3600000) // 1 hour in milliseconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <PlantContext.Provider
      value={{
        plants,
        addPlant,
        updatePlant,
        deletePlant,
        waterPlant,
        fertilizePlant,
        updatePlantHealth,
        getPlantById,
        stats,
      }}
    >
      {children}
    </PlantContext.Provider>
  )
}

export function usePlants() {
  const context = useContext(PlantContext)
  if (context === undefined) {
    throw new Error("usePlants must be used within a PlantProvider")
  }
  return context
}
