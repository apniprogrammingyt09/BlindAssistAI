"use client"

import { useEffect, useRef } from "react"

interface Position {
  x: number // 0-1 value representing horizontal position (0 = left, 1 = right)
  y: number // 0-1 value representing vertical position (0 = top, 1 = bottom)
  label: string
  distance?: number
  color?: string
}

interface DetectionVisualizerProps {
  positions: Position[]
  width: number
  height: number
}

export default function DetectionVisualizer({ positions, width, height }: DetectionVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = "#f8fafc" // Light gray background
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // Vertical lines (left, center, right)
    for (let i = 1; i < 3; i++) {
      const x = (width / 3) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines (distance markers)
    for (let i = 1; i < 3; i++) {
      const y = (height / 3) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw positions
    positions.forEach((pos) => {
      const x = pos.x * width
      const y = pos.y * height

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.fillStyle = pos.color || "#3b82f6"
      ctx.fill()

      // Draw label
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#1e293b"
      ctx.textAlign = "center"
      ctx.fillText(pos.label, x, y + 30)

      // Draw distance if available
      if (pos.distance !== undefined) {
        ctx.font = "10px sans-serif"
        ctx.fillStyle = "#64748b"
        ctx.fillText(`${Math.round(pos.distance)}cm`, x, y + 45)
      }
    })

    // Draw legend
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.fillText("Left", width / 6, height - 5)
    ctx.fillText("Center", width / 2, height - 5)
    ctx.fillText("Right", (width / 6) * 5, height - 5)

    // Draw user indicator at bottom center
    ctx.beginPath()
    ctx.moveTo(width / 2, height - 20)
    ctx.lineTo(width / 2 - 10, height - 30)
    ctx.lineTo(width / 2 + 10, height - 30)
    ctx.closePath()
    ctx.fillStyle = "#475569"
    ctx.fill()
  }, [positions, width, height])

  return <canvas ref={canvasRef} width={width} height={height} className="mx-auto border rounded-md" />
}
