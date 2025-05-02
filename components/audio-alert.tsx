"use client"

import { useEffect, useRef } from "react"

interface AudioAlertProps {
  message: string
  play: boolean
}

export default function AudioAlert({ message, play }: AudioAlertProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const previousMessageRef = useRef<string>("")

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      utteranceRef.current = new SpeechSynthesisUtterance()
      utteranceRef.current.rate = 1.0
      utteranceRef.current.pitch = 1.0
      utteranceRef.current.volume = 1.0
    }

    // Cleanup
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    // Only speak if play is true and we have a message
    if (play && message && message !== previousMessageRef.current) {
      if (window.speechSynthesis && utteranceRef.current) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        // Set the new message
        utteranceRef.current.text = message

        // Speak the message
        window.speechSynthesis.speak(utteranceRef.current)

        // Update previous message
        previousMessageRef.current = message
      }
    }
  }, [message, play])

  return null // This component doesn't render anything
}
