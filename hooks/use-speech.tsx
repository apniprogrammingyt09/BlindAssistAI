"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const speakQueueRef = useRef<string[]>([])
  const isSpeakingRef = useRef(false)
  const lastSpokenRef = useRef<Record<string, number>>({})
  const recentMessagesRef = useRef<Set<string>>(new Set())
  const [isSynthAvailable, setIsSynthAvailable] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
        setIsSynthAvailable(true)

        // Initialize voices
        if (synthRef.current.onvoiceschanged !== undefined) {
          synthRef.current.onvoiceschanged = () => {
            console.log("Voices loaded:", synthRef.current?.getVoices().length)
          }
        }
      } else {
        console.error("Speech synthesis not supported")
        setIsSynthAvailable(false)
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const processSpeakQueue = useCallback(() => {
    if (!synthRef.current || speakQueueRef.current.length === 0 || isSpeakingRef.current) {
      return
    }

    isSpeakingRef.current = true
    setIsSpeaking(true)
    const text = speakQueueRef.current.shift() as string

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Try to use a good voice if available
      const voices = synthRef.current.getVoices()
      const englishVoices = voices.filter((voice) => voice.lang.includes("en") && !voice.name.includes("Google"))

      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0]
      }

      // Handle errors properly
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e)
        isSpeakingRef.current = false
        setIsSpeaking(false)
        processSpeakQueue()
      }

      utterance.onend = () => {
        isSpeakingRef.current = false
        setIsSpeaking(false)
        setTimeout(() => {
          processSpeakQueue()
        }, 300) // Small delay between speeches
      }

      synthRef.current.speak(utterance)
    } catch (e) {
      console.error("Error creating utterance:", e)
      isSpeakingRef.current = false
      setIsSpeaking(false)
      processSpeakQueue()
    }
  }, [])

  // Update the speak function to accept a force parameter
  const speak = useCallback(
    (text: string, force = false) => {
      if (!synthRef.current) {
        console.error("Speech synthesis not available")

        // Fallback to alert for debugging
        if (force) {
          alert("Speech would say: " + text)
        }
        return
      }

      // If force is true, cancel any ongoing speech and clear the queue
      if (force && synthRef.current) {
        synthRef.current.cancel()
        speakQueueRef.current = []
        isSpeakingRef.current = false
        setIsSpeaking(false)
      }

      // Prevent repeating the same message too frequently (within 5 seconds)
      const now = Date.now()
      const lastSpoken = lastSpokenRef.current[text] || 0

      if (!force && now - lastSpoken < 5000) {
        return
      }

      // Check for similar messages (to avoid "Obstacle at left" followed by "Obstacle at right" too quickly)
      if (!force) {
        const messageBase = text.split(" to your ")[0] // Get the first part of the message
        const similarMessages = Array.from(recentMessagesRef.current).filter(
          (msg) => msg.startsWith(messageBase) && now - lastSpokenRef.current[msg] < 3000,
        )

        if (similarMessages.length > 0) {
          return // Skip if a similar message was spoken very recently
        }
      }

      lastSpokenRef.current[text] = now
      recentMessagesRef.current.add(text)

      // Clean up old messages from the set
      setTimeout(() => {
        recentMessagesRef.current.delete(text)
      }, 5000)

      // Add to queue and process
      speakQueueRef.current.push(text)
      console.log("Added to speech queue:", text)

      if (!isSpeakingRef.current) {
        processSpeakQueue()
      }
    },
    [processSpeakQueue],
  )

  return { speak, isSynthAvailable, isSpeaking }
}
