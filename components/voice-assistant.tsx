"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSpeech } from "@/hooks/use-speech"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const router = useRouter()
  const { speak, isSpeaking } = useSpeech()
  const recognitionRef = useRef<any>(null)
  const lastWakeAttemptRef = useRef<number>(0)
  const lastSpokenTextRef = useRef<string>("")
  const ignoreNextTranscriptRef = useRef<boolean>(false)

  // Add debug info
  const addDebug = (message: string) => {
    console.log("Voice Assistant:", message)
    setDebugInfo((prev) => [...prev.slice(-4), message])
  }

  // Initialize audio context for beep sound
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.error("Could not initialize audio context:", e)
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play activation beep sound
  const playActivationBeep = () => {
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContextRef.current.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 0.2)

      addDebug("Activation beep played")
    } catch (e) {
      console.error("Error playing beep:", e)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser")
      addDebug("Speech recognition not supported")
      return
    }

    try {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
        addDebug("Recognition started")
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        addDebug("Recognition ended")

        // Auto-restart if we're not processing a command and not speaking
        if (!isProcessingCommand && !isSpeaking) {
          try {
            // Add a delay before restarting to avoid picking up the assistant's own voice
            setTimeout(() => {
              if (recognitionRef.current && !isSpeaking && !isProcessingCommand) {
                recognitionRef.current.start()
                addDebug("Restarting recognition after delay")
              }
            }, 500)
          } catch (e) {
            addDebug(`Failed to restart: ${e}`)
          }
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        // Ignore aborted errors as they happen during normal operation
        if (event.error !== "aborted") {
          addDebug(`Recognition error: ${event.error}`)
          setError(`Error: ${event.error}`)
        }
        setIsListening(false)
      }

      recognitionRef.current.onresult = (event: any) => {
        // Get the latest result
        const current = event.resultIndex
        const result = event.results[current][0].transcript.trim().toLowerCase()

        // Update the transcript for display
        setTranscript(result)

        // Check if this is the assistant's own voice
        if (ignoreNextTranscriptRef.current) {
          addDebug(`Ignoring assistant's own voice: ${result}`)
          return
        }

        // Check if the transcript is similar to what the assistant just said
        const lastSpoken = lastSpokenTextRef.current.toLowerCase()
        if (
          lastSpoken &&
          (result.includes(lastSpoken) || lastSpoken.includes(result) || isSimilarText(result, lastSpoken))
        ) {
          addDebug(`Detected assistant's own voice, ignoring: ${result}`)
          return
        }

        addDebug(`Heard: ${result}`)

        // Process command directly if it's a final result
        if (event.results[current].isFinal) {
          processCommand(result)
        }
      }
    } catch (e) {
      addDebug(`Setup error: ${e}`)
      setError(`Setup error: ${e}`)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }
    }
  }, [isSpeaking, isProcessingCommand])

  // Helper function to check if two texts are similar
  const isSimilarText = (text1: string, text2: string) => {
    // Simple similarity check - if more than 50% of words match
    const words1 = text1.split(/\s+/).filter((w) => w.length > 3)
    const words2 = text2.split(/\s+/).filter((w) => w.length > 3)

    let matchCount = 0
    for (const word of words1) {
      if (words2.some((w) => w.includes(word) || word.includes(w))) {
        matchCount++
      }
    }

    return words1.length > 0 && matchCount / words1.length > 0.3
  }

  // Effect to pause recognition while speaking to avoid feedback loop
  useEffect(() => {
    if (isSpeaking && recognitionRef.current) {
      try {
        addDebug("Stopping recognition while speaking")
        recognitionRef.current.stop()
        setIsListening(false)
        ignoreNextTranscriptRef.current = true
      } catch (e) {
        addDebug(`Error stopping recognition: ${e}`)
      }
    } else if (!isSpeaking && !isListening && !isProcessingCommand) {
      // Add a delay before restarting recognition after speaking
      const timer = setTimeout(() => {
        try {
          if (recognitionRef.current && !isProcessingCommand) {
            addDebug("Resuming recognition after speaking")
            recognitionRef.current.start()
            // Reset the ignore flag after a delay
            setTimeout(() => {
              ignoreNextTranscriptRef.current = false
            }, 1000)
          }
        } catch (e) {
          addDebug(`Error starting recognition: ${e}`)
        }
      }, 1000) // Longer delay after speaking

      return () => clearTimeout(timer)
    }
  }, [isSpeaking, isListening, isProcessingCommand])

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available")
      addDebug("Recognition not available")
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      setError(null)
      addDebug("Starting recognition")
    } catch (e) {
      addDebug(`Start error: ${e}`)
      setError(`Start error: ${e}`)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
      setIsListening(false)
      addDebug("Stopping recognition")
    } catch (e) {
      addDebug(`Stop error: ${e}`)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Modified speak function that tracks what was said
  const speakWithTracking = (text: string, force = false) => {
    // Store what the assistant is about to say
    lastSpokenTextRef.current = text
    // Set the ignore flag
    ignoreNextTranscriptRef.current = true
    // Speak the text
    speak(text, force)
  }

  // Update the processCommand function to check for the wake phrase
  const processCommand = (command: string) => {
    addDebug(`Processing: ${command}`)

    // Check for wake phrase with more variations
    // This simpler approach checks if the command starts with any of the wake phrases
    const wakePhrases = ["hi assist", "hi assistant", "hey assist", "hey assistant", "hello assist", "hello assistant"]

    let isWakePhraseDetected = false
    let actualCommand = command

    // Check each wake phrase
    for (const phrase of wakePhrases) {
      if (command.startsWith(phrase)) {
        isWakePhraseDetected = true
        // Extract the command after the wake phrase
        actualCommand = command.substring(phrase.length).trim()
        addDebug(`Wake phrase detected: ${phrase}`)

        // Play activation beep
        playActivationBeep()

        // Show feedback panel when wake phrase is detected
        setShowFeedback(true)

        break
      }
    }

    if (!isWakePhraseDetected) {
      addDebug("Wake phrase not detected")

      // Record the time of the last wake attempt
      lastWakeAttemptRef.current = Date.now()

      // Restart recognition immediately to improve responsiveness
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop()
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start()
                addDebug("Quick restart after wake phrase not detected")
              } catch (e) {
                addDebug(`Failed quick restart: ${e}`)
              }
            }
          }, 100)
        } catch (e) {
          addDebug(`Error in quick restart: ${e}`)
        }
      }

      return
    }

    setIsProcessingCommand(true)

    addDebug(`Command after wake phrase: ${actualCommand}`)

    // If there's no command after the wake phrase, just acknowledge
    if (!actualCommand) {
      speakWithTracking("Yes, I'm listening. How can I help you?", true)
      setIsProcessingCommand(false)
      return
    }

    // Process navigation commands with pronunciation variations
    // Home page commands
    if (
      actualCommand.includes("go to home") ||
      actualCommand.includes("home page") ||
      actualCommand.includes("go home") ||
      actualCommand === "home"
    ) {
      speakWithTracking("Going to home page", true)
      addDebug("Command: home page")
      setTimeout(() => {
        router.push("/")
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    }
    // About page commands
    else if (
      actualCommand.includes("tell about") ||
      actualCommand.includes("about page") ||
      actualCommand.includes("about you") ||
      actualCommand === "about"
    ) {
      speakWithTracking("Going to about page", true)
      addDebug("Command: about page")
      setTimeout(() => {
        router.push("/about")
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    }
    // How to use commands
    else if (
      actualCommand.includes("how to use") ||
      actualCommand.includes("how use") ||
      actualCommand === "help" ||
      actualCommand === "how"
    ) {
      speakWithTracking("Going to how to use page", true)
      addDebug("Command: how to use")
      setTimeout(() => {
        router.push("/how-to-use")
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    }
    // Walking mode commands
    else if (
      actualCommand.includes("walking mode") ||
      actualCommand.includes("working mode") ||
      actualCommand.includes("activate walking") ||
      actualCommand === "walking" ||
      actualCommand === "working"
    ) {
      speakWithTracking("Activating walking mode", true)
      addDebug("Command: walking mode")
      setTimeout(() => {
        router.push("/walking-mode")
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    }
    // Interaction mode commands
    else if (
      actualCommand.includes("interaction mode") ||
      actualCommand.includes("invention mode") ||
      actualCommand.includes("activate interaction") ||
      actualCommand === "interaction" ||
      actualCommand === "invention"
    ) {
      speakWithTracking("Activating interaction mode", true)
      addDebug("Command: interaction mode")
      setTimeout(() => {
        router.push("/interaction-mode")
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    }
    // Unknown command
    else {
      speakWithTracking("I didn't understand that command. Please try again.", true)
      addDebug("Command not recognized")
      setIsProcessingCommand(false)
    }
  }

  // Manual activation button handler
  const handleManualActivate = () => {
    setShowFeedback(true)
    playActivationBeep()
    speakWithTracking("I'm listening for commands", true)
  }

  // Start listening automatically when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startListening()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Floating activation button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <Button
          variant={isListening ? "default" : "secondary"}
          size="icon"
          onClick={toggleListening}
          title={isListening ? "Stop Listening" : "Start Listening"}
        >
          {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleManualActivate}
          className="bg-white"
          title="Activate Voice Assistant"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Activate Assistant
        </Button>
      </div>

      {/* Feedback panel - always show when speaking */}
      {(showFeedback || isSpeaking) && (
        <Card className="fixed top-4 right-4 z-50 w-80 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Mic className={`h-4 w-4 mr-2 ${isListening ? "text-green-500" : "text-gray-500"}`} />
                <span className="font-medium">
                  {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowFeedback(false)}>
                ×
              </Button>
            </div>

            <div className="bg-gray-100 p-2 rounded text-sm min-h-[40px] mb-2">{transcript || "Say something..."}</div>

            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

            <div className="text-xs text-gray-500 mt-1">
              Say "Hi Assist AI" or "Hi Assistant AI" followed by a command like "go to home" or "walking mode"
            </div>

            {/* Debug info */}
            <div className="mt-2 border-t pt-2">
              <div className="text-xs font-semibold">Debug Info:</div>
              <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                {debugInfo.map((info, i) => (
                  <div key={i}>{info}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
