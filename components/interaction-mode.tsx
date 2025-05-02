"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users } from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import CameraFeed from "@/components/camera-feed"
import DetectionVisualizer from "@/components/detection-visualizer"

type PersonDetails = {
  distance?: number
  distance_cm?: number
  position: string
}

type InteractionDetection = {
  people: Array<Record<string, PersonDetails>> | Record<string, PersonDetails>
}

export default function InteractionMode() {
  const [detections, setDetections] = useState<Record<string, PersonDetails>>({})
  const [counts, setCounts] = useState<{ Left: number; Center: number; Right: number }>({
    Left: 0,
    Center: 0,
    Right: 0,
  })
  const [isActive, setIsActive] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Initializing camera...")
  const lastAnnouncementRef = useRef<string>("")
  const lastSpeechTimeRef = useRef<number>(0)

  const { speak, isSpeaking } = useSpeech()

  // Process frame and send to API
  const processFrame = useCallback(
    async (imageBlob: Blob) => {
      try {
        // Create form data for API request
        const formData = new FormData()
        formData.append("file", imageBlob, "frame.jpg")

        const response = await fetch("https://krish09bha-interactive-mode.hf.space/detect", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()

          if (data && data.people) {
            // Normalize the API response
            const normalizedPeople: Record<string, PersonDetails> = {}

            // Handle array format: [{"person1": {data}}, {"person2": {data}}]
            if (Array.isArray(data.people)) {
              data.people.forEach((personObj) => {
                const personId = Object.keys(personObj)[0]
                if (personId) {
                  const personData = personObj[personId]
                  // Handle both distance and distance_cm fields
                  normalizedPeople[personId] = {
                    ...personData,
                    // Ensure we have distance_cm for consistency
                    distance_cm: personData.distance_cm || personData.distance,
                  }
                }
              })
            }
            // Handle object format: {"person1": {data}, "person2": {data}}
            else if (typeof data.people === "object") {
              Object.entries(data.people).forEach(([personId, personData]) => {
                normalizedPeople[personId] = {
                  ...personData,
                  // Ensure we have distance_cm for consistency
                  distance_cm: personData.distance_cm || personData.distance,
                }
              })
            }

            setDetections(normalizedPeople)

            // Calculate counts
            const newCounts = { Left: 0, Center: 0, Right: 0 }
            Object.values(normalizedPeople).forEach((person) => {
              if (person && person.position in newCounts) {
                newCounts[person.position as keyof typeof newCounts]++
              }
            })
            setCounts(newCounts)

            // Generate audio message
            if (Object.keys(normalizedPeople).length > 0) {
              const totalPeople = Object.keys(normalizedPeople).length
              let message = `Detected ${totalPeople} ${totalPeople === 1 ? "person" : "people"}.`

              if (newCounts.Left > 0) {
                message += ` ${newCounts.Left} on your left.`
              }
              if (newCounts.Center > 0) {
                message += ` ${newCounts.Center} in center.`
              }
              if (newCounts.Right > 0) {
                message += ` ${newCounts.Right} on your right.`
              }

              // Find closest person
              let closestDistance = Number.POSITIVE_INFINITY
              let closestPosition = ""

              Object.entries(normalizedPeople).forEach(([personId, person]) => {
                const distance = person.distance_cm || person.distance
                if (person && typeof distance === "number" && distance < closestDistance) {
                  closestDistance = distance
                  closestPosition = person.position
                }
              })

              if (closestPosition) {
                message += ` Closest person is ${Math.round(closestDistance)} centimeters away on your ${closestPosition.toLowerCase()}.`
              }

              // Store the latest announcement
              lastAnnouncementRef.current = message

              // Only speak if not currently speaking or if it's been more than 5 seconds
              const now = Date.now()
              if (!isSpeaking || now - lastSpeechTimeRef.current > 5000) {
                speak(message)
                lastSpeechTimeRef.current = now
              }
            }
          } else {
            // Clear detections when no people are detected
            setDetections({})
            setCounts({ Left: 0, Center: 0, Right: 0 })

            // If there were previous detections and now there are none, announce no people detected
            if (Object.keys(detections).length > 0) {
              const message = "No people detected nearby"
              lastAnnouncementRef.current = message

              // Only speak if not currently speaking or if it's been more than 5 seconds
              const now = Date.now()
              if (!isSpeaking || now - lastSpeechTimeRef.current > 5000) {
                speak(message)
                lastSpeechTimeRef.current = now
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending frame to API:", error)
        setDetections({})
        setCounts({ Left: 0, Center: 0, Right: 0 })
      }
    },
    [detections, speak, isSpeaking],
  )

  // Effect to repeat the latest announcement after other speech finishes
  useEffect(() => {
    if (!isSpeaking && lastAnnouncementRef.current) {
      const timeoutId = setTimeout(() => {
        // Check if there's a latest announcement and we haven't spoken in the last 3 seconds
        const now = Date.now()
        if (lastAnnouncementRef.current && now - lastSpeechTimeRef.current > 3000) {
          speak(lastAnnouncementRef.current)
          lastSpeechTimeRef.current = now
        }
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [isSpeaking, speak])

  // Convert detections to positions for visualization
  const detectionsToPositions = (detections: Record<string, PersonDetails>) => {
    const positions: Array<{
      x: number
      y: number
      label: string
      distance?: number
      color?: string
    }> = []

    Object.entries(detections).forEach(([personId, data]) => {
      // Skip if data is undefined
      if (!data) return

      // Default position mapping
      let x = 0.5 // Default to center
      if (data.position === "Left") x = 0.25
      if (data.position === "Right") x = 0.75

      // Calculate y based on distance (closer = lower y value)
      const distance = data.distance_cm || data.distance || 200

      // Map distance from 0-500cm to 0.2-0.8 y position (inverted, closer is higher on screen)
      const maxDistance = 500
      const distanceNormalized = Math.min(distance, maxDistance) / maxDistance
      const y = 0.2 + distanceNormalized * 0.6

      // Color coding by position
      let color = "#3b82f6" // Blue for Left
      if (data.position === "Center") color = "#8b5cf6" // Purple for Center
      if (data.position === "Right") color = "#f97316" // Orange for Right

      positions.push({
        x,
        y,
        label: `Person ${personId.replace("person", "")}`,
        distance: distance,
        color,
      })
    })

    return positions
  }

  // Handle camera state changes
  const handleCameraStateChange = (streaming: boolean) => {
    setIsActive(streaming)
    if (streaming) {
      setStatusMessage("Camera active. Looking for people...")
      speak("Interaction mode activated. Looking for people around you.")
    } else {
      setStatusMessage("Camera is off")
      setDetections({})
      setCounts({ Left: 0, Center: 0, Right: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <CameraFeed onFrame={processFrame} interval={1500} onStreamingChange={handleCameraStateChange} />

      <Alert variant={Object.keys(detections).length > 0 ? "default" : "default"}>
        <Users className="h-4 w-4" />
        <AlertDescription>
          {Object.keys(detections).length > 0 ? `${Object.keys(detections).length} person(s) detected` : statusMessage}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Position Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-md ${counts.Left > 0 ? "bg-blue-100" : "bg-gray-100"}`}>
                <h3 className="text-lg font-medium">Left</h3>
                <p className={`text-3xl font-bold mt-2 ${counts.Left > 0 ? "text-blue-700" : "text-gray-500"}`}>
                  {counts.Left}
                </p>
              </div>
              <div className={`p-4 rounded-md ${counts.Center > 0 ? "bg-purple-100" : "bg-gray-100"}`}>
                <h3 className="text-lg font-medium">Center</h3>
                <p className={`text-3xl font-bold mt-2 ${counts.Center > 0 ? "text-purple-700" : "text-gray-500"}`}>
                  {counts.Center}
                </p>
              </div>
              <div className={`p-4 rounded-md ${counts.Right > 0 ? "bg-orange-100" : "bg-gray-100"}`}>
                <h3 className="text-lg font-medium">Right</h3>
                <p className={`text-3xl font-bold mt-2 ${counts.Right > 0 ? "text-orange-700" : "text-gray-500"}`}>
                  {counts.Right}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Face Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <DetectionVisualizer positions={detectionsToPositions(detections)} width={300} height={200} />
            {!isActive && <div className="text-center mt-4 text-gray-500">Initializing camera...</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Detected People:</h3>
          {Object.keys(detections).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(detections).map(([personId, details]) => {
                const distance = details.distance_cm || details.distance
                return (
                  <li key={personId} className="p-2 bg-gray-100 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-semibold">{personId}</span>
                      <span className={`${distance < 100 ? "text-red-600 font-bold" : "text-blue-600"}`}>
                        {distance < 100 ? "Very close" : `${Math.round(distance)} cm`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Position: {details.position}</div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No people detected nearby</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
