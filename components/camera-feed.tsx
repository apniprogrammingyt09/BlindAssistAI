"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CameraFeedProps {
  onFrame: (blob: Blob) => void
  interval?: number
  onStreamingChange?: (streaming: boolean) => void
}

export default function CameraFeed({ onFrame, interval = 1000, onStreamingChange }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-start camera on component mount
  useEffect(() => {
    startCamera()

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsStreaming(true)
      if (onStreamingChange) onStreamingChange(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const captureFrame = () => {
      if (!isStreaming || !videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onFrame(blob)
          }
        },
        "image/jpeg",
        0.8,
      )
    }

    if (isStreaming) {
      // Initial capture after a short delay to ensure video is ready
      const initialTimeout = setTimeout(() => {
        captureFrame()
        // Then set up regular interval
        intervalId = setInterval(captureFrame, interval)
      }, 500)

      return () => {
        clearTimeout(initialTimeout)
        if (intervalId) clearInterval(intervalId)
      }
    }

    return undefined
  }, [isStreaming, interval, onFrame])

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <p>{error || "Initializing camera..."}</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
