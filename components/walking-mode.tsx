"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import CameraFeed from "@/components/camera-feed"
import DetectionVisualizer from "@/components/detection-visualizer"

type ObstacleDetails = {
  distance: string
  position: string
  status?: string
}

type WalkingDetection = {
  detected_changes?: Record<string, ObstacleDetails>
}

export default function WalkingMode() {
  const [detections, setDetections] = useState<WalkingDetection>({})
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

        const response = await fetch("https://krish09bha-walking-mode.hf.space/detect", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data: WalkingDetection = await response.json()

          if (data && data.detected_changes && Object.keys(data.detected_changes).length > 0) {
            // Keep track of previous detections to only announce changes
            const prevDetections = detections.detected_changes || {}
            setDetections(data)

            // Calculate counts
            const newCounts = { Left: 0, Center: 0, Right: 0 }
            Object.values(data.detected_changes).forEach((details) => {
              if (details.status !== "Removed" && details.position in newCounts) {
                newCounts[details.position as keyof typeof newCounts]++
              }
            })
            setCounts(newCounts)

            // Prioritize Near obstacles first
            const nearObstacles = Object.entries(data.detected_changes).filter(
              ([_, details]) => details.status !== "Removed" && details.distance === "Near",
            )

            if (nearObstacles.length > 0) {
              // Immediately announce the closest obstacle
              const [_, details] = nearObstacles[0]
              let message = `Caution! Obstacle very close to you`
              if (details.position === "Center") {
                message += " directly in front of you"
              } else {
                message += ` to your ${details.position.toLowerCase()}`
              }

              // Force immediate speech for near obstacles
              speak(message, true)
              lastAnnouncementRef.current = message
              lastSpeechTimeRef.current = Date.now()
              return // Exit early to prioritize this critical message
            }

            // If no near obstacles, check for medium obstacles
            const mediumObstacles = Object.entries(data.detected_changes).filter(
              ([_, details]) => details.status !== "Removed" && details.distance === "Medium",
            )

            if (mediumObstacles.length > 0) {
              // Announce medium distance obstacle
              const [_, details] = mediumObstacles[0]
              let message = `Obstacle approaching`
              if (details.position === "Center") {
                message += " directly in front of you"
              } else {
                message += ` to your ${details.position.toLowerCase()}`
              }

              speak(message, true)
              lastAnnouncementRef.current = message
              lastSpeechTimeRef.current = Date.now()
              return
            }

            // If no critical obstacles, just announce one far obstacle if present
            const farObstacles = Object.entries(data.detected_changes).filter(
              ([_, details]) => details.status !== "Removed" && details.distance === "Far",
            )

            if (farObstacles.length > 0) {
              const [_, details] = farObstacles[0]
              let message = `Obstacle detected ahead`
              if (details.position === "Center") {
                message += " directly in front of you"
              } else {
                message += ` to your ${details.position.toLowerCase()}`
              }

              speak(message)
              lastAnnouncementRef.current = message
              lastSpeechTimeRef.current = Date.now()
            }
          } else {
            // Clear detections when no obstacles are detected
            const hadPreviousDetections =
              detections.detected_changes && Object.keys(detections.detected_changes).length > 0

            setDetections({})
            setCounts({ Left: 0, Center: 0, Right: 0 })

            // Only announce path is clear if we previously had detections
            // and haven't announced it recently
            if (hadPreviousDetections) {
              const now = Date.now()
              const timeSinceLastAnnouncement = now - lastSpeechTimeRef.current

              // Only announce path clear if it's been at least 3 seconds since last announcement
            }
          }
        }
      } catch (error) {
        console.error("Error sending frame to API:", error)
        setDetections({})
        setCounts({ Left: 0, Center: 0, Right: 0 })
      }
    },
    [detections, speak],
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
  const detectionsToPositions = () => {
    const positions: Array<{
      x: number
      y: number
      label: string
      distance?: number
      color?: string
    }> = []

    if (!detections.detected_changes) return positions

    Object.entries(detections.detected_changes).forEach(([objectId, details], index) => {
      // Skip removed obstacles
      if (details.status === "Removed") return

      // Default position mapping
      let x = 0.5 // Default to center
      if (details.position === "Left") x = 0.25
      if (details.position === "Right") x = 0.75

      // Calculate y based on distance
      let y = 0.5
      if (details.distance === "Near") y = 0.3
      else if (details.distance === "Medium") y = 0.5
      else if (details.distance === "Far") y = 0.7

      // Color coding by distance
      let color = "#3b82f6" // Blue for Far
      if (details.distance === "Near") color = "#ef4444" // Red for Near
      if (details.distance === "Medium") color = "#f97316" // Orange for Medium

      positions.push({
        x,
        y,
        label: `Obstacle ${index + 1}`,
        color,
      })
    })

    return positions
  }

  // Handle camera state changes
  const handleCameraStateChange = (streaming: boolean) => {
    setIsActive(streaming)
    if (streaming) {
      setStatusMessage("Camera active. Looking for obstacles...")
      speak("Walking mode activated. Looking for obstacles in your path.", true)
    } else {
      setStatusMessage("Camera is off")
      setDetections({})
      setCounts({ Left: 0, Center: 0, Right: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <CameraFeed onFrame={processFrame} interval={1000} onStreamingChange={handleCameraStateChange} />

      <Alert
        variant={
          detections.detected_changes && Object.keys(detections.detected_changes).length > 0 ? "destructive" : "default"
        }
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {detections.detected_changes && Object.keys(detections.detected_changes).length > 0
            ? "Obstacles detected in your path!"
            : statusMessage}
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
            <CardTitle>Obstacle Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <DetectionVisualizer positions={detectionsToPositions()} width={300} height={200} />
            {!isActive && <div className="text-center mt-4 text-gray-500">Initializing camera...</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Detected Obstacles:</h3>
          {detections.detected_changes && Object.keys(detections.detected_changes).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(detections.detected_changes).map(([object, details]) => (
                <li key={object} className="p-2 bg-gray-100 rounded-md">
                  <span className="font-semibold">Obstacle</span>:
                  {details.status === "Removed" ? (
                    <span className="text-green-600 ml-2">No longer in path</span>
                  ) : (
                    <span className="ml-2">
                      {details.distance === "Near" ? (
                        <span className="text-red-600 font-bold">Very close</span>
                      ) : details.distance === "Medium" ? (
                        <span className="text-amber-600">Approaching</span>
                      ) : (
                        <span className="text-blue-600">Far ahead</span>
                      )}
                      {" to your "}
                      {details.position.toLowerCase()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No obstacles detected in your path</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
