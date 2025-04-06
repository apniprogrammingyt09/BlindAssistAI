"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSpeech } from "@/hooks/use-speech"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

declare global {
  interface Window {
    navigationTimeout: NodeJS.Timeout | undefined
    safetyTimeout: NodeJS.Timeout | undefined
  }
}

// Function to calculate phonetic similarity between two strings
function phoneticSimilarity(str1: string, str2: string): number {
  // Convert to lowercase and remove non-alphanumeric characters
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "")

  const a = normalize(str1)
  const b = normalize(str2)

  // Simple implementation of Soundex-like algorithm
  // For each word, keep first letter and replace others with phonetic codes
  const getSoundexCode = (word: string): string => {
    if (!word) return ""

    // Keep first letter
    const code = word[0].toUpperCase()

    // Replace consonants with numbers
    const replacements: Record<string, string> = {
      bfpv: "1",
      cgjkqsxz: "2",
      dt: "3",
      l: "4",
      mn: "5",
      r: "6",
    }

    // Process rest of the word
    for (let i = 1; i < word.length; i++) {
      const char = word[i].toLowerCase()

      // Skip vowels and 'h', 'w', 'y'
      if ("aeiouhwy".includes(char)) continue

      // Find replacement code
      for (const [chars, code] of Object.entries(replacements)) {
        if (chars.includes(char)) {
          // Only add if different from previous code
          let currentCode = code
          if (currentCode !== currentCode[currentCode.length - 1]) {
            currentCode += currentCode
          }
          break
        }
      }

      // Limit to 4 characters
      if (code.length >= 4) break
    }

    // Pad with zeros if needed
    return (code + "000").substring(0, 4)
  }

  // Split into words and get Soundex codes
  const aWords = a.split(/\s+/).filter(Boolean)
  const bWords = b.split(/\s+/).filter(Boolean)

  const aCodes = aWords.map(getSoundexCode)
  const bCodes = bWords.map(getSoundexCode)

  // Calculate similarity based on matching codes
  let matches = 0
  for (const aCode of aCodes) {
    if (bCodes.includes(aCode)) {
      matches++
    }
  }

  // Calculate similarity score (0 to 1)
  const maxLength = Math.max(aCodes.length, bCodes.length)
  return maxLength > 0 ? matches / maxLength : 0
}

// Add this function at the top of the component (after the phoneticSimilarity function)
// This will force a navigation to happen
function forceNavigation(path: string) {
  addDebug(`FORCE NAVIGATION: ${path}`)

  // Try multiple navigation methods
  try {
    // Method 1: Direct location change
    window.location.href = path
  } catch (e) {
    addDebug(`Method 1 failed: ${e}`)

    try {
      // Method 2: Router push
      router.push(path)
    } catch (e) {
      addDebug(`Method 2 failed: ${e}`)

      try {
        // Method 3: Location assign
        window.location.assign(path)
      } catch (e) {
        addDebug(`Method 3 failed: ${e}`)

        try {
          // Method 4: Location replace
          window.location.replace(path)
        } catch (e) {
          addDebug(`Method 4 failed: ${e}`)
        }
      }
    }
  }
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)
  const [wakeWordDetected, setWakeWordDetected] = useState(false)

  // Track if we're currently trying to start/stop recognition to avoid race conditions
  const isStartingRef = useRef(false)
  const isStoppingRef = useRef(false)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRecognitionEventRef = useRef<number>(0)
  const cycleCountRef = useRef<number>(0)

  const router = useRouter()
  const { speak, isSpeaking } = useSpeech()
  const recognitionRef = useRef<any>(null)

  // Add debug info
  const addDebug = (message: string) => {
    console.log("Voice Assistant:", message)
    setDebugInfo((prev) => [...prev.slice(-4), message])
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
      // Only create the recognition instance once
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          isStartingRef.current = false
          lastRecognitionEventRef.current = Date.now()
          setError(null)
          addDebug("Recognition started")
        }

        recognitionRef.current.onend = () => {
          const now = Date.now()
          const timeSinceLastEvent = now - lastRecognitionEventRef.current
          lastRecognitionEventRef.current = now

          setIsListening(false)
          isStoppingRef.current = false
          addDebug(`Recognition ended (${timeSinceLastEvent}ms since last event)`)

          // Check if we're cycling too quickly
          if (timeSinceLastEvent < 1000) {
            cycleCountRef.current++
            addDebug(`Quick cycle detected (count: ${cycleCountRef.current})`)

            // If we've cycled too many times, add a longer delay
            if (cycleCountRef.current > 3) {
              addDebug("Too many quick cycles, adding longer delay")
              safelyRestartRecognition(3000)
              cycleCountRef.current = 0
              return
            }
          } else {
            // Reset cycle count if we had a normal duration
            cycleCountRef.current = 0
          }

          // Only auto-restart if we're not processing a command and not speaking
          if (!isProcessingCommand && !isSpeaking && !isStoppingRef.current) {
            // Use a longer delay to prevent rapid cycling
            safelyRestartRecognition(1000)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          // Ignore aborted errors as they happen during normal operation
          if (event.error !== "aborted") {
            addDebug(`Recognition error: ${event.error}`)
            setError(`Error: ${event.error}`)
          }

          // If we get a "network" error, we should try to restart after a delay
          if (event.error === "network") {
            safelyRestartRecognition(3000)
          }

          setIsListening(false)
          isStartingRef.current = false
          isStoppingRef.current = false
        }

        recognitionRef.current.onresult = (event: any) => {
          lastRecognitionEventRef.current = Date.now()

          // Get the latest result
          const current = event.resultIndex
          const result = event.results[current][0].transcript.trim().toLowerCase()

          // Update the transcript for display
          if (result) {
            setTranscript(result)
            addDebug(`Heard: ${result}`)

            // Only process final results to avoid partial command issues
            if (event.results[current].isFinal) {
              // Add a small delay to ensure we get the complete command
              setTimeout(() => {
                // Check if this is a simple command or part of a longer command
                const words = result.split(/\s+/)

                // If it's a very short command (1-2 words), process it immediately
                if (words.length <= 2 || result.includes("go to")) {
                  addDebug(`Processing command immediately: ${result}`)
                  processCommand(result)
                } else {
                  // For longer commands, wait a bit to see if more words come in
                  addDebug(`Waiting for complete command: ${result}`)
                  setTimeout(() => {
                    processCommand(result)
                  }, 500)
                }
              }, 100)
            }
          }
        }
      }
    } catch (e) {
      addDebug(`Setup error: ${e}`)
      setError(`Setup error: ${e}`)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          safelyStopRecognition()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }

      // Clear any pending timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }, [])

  // Safely start recognition with error handling
  const safelyStartRecognition = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available")
      addDebug("Recognition not available")
      return
    }

    // If we're already starting or listening, don't try to start again
    if (isStartingRef.current || isListening) {
      addDebug("Already starting or listening, ignoring start request")
      return
    }

    try {
      isStartingRef.current = true
      addDebug("Attempting to start recognition")
      recognitionRef.current.start()
    } catch (e) {
      isStartingRef.current = false

      // If we get an "already started" error, update our state to match reality
      if (e instanceof DOMException && e.message.includes("already started")) {
        addDebug("Recognition was already started")
        setIsListening(true)
      } else {
        addDebug(`Start error: ${e}`)
        setError(`Start error: ${e}`)

        // If we get an error starting, try again after a delay
        safelyRestartRecognition(2000)
      }
    }
  }

  // Safely stop recognition with error handling
  const safelyStopRecognition = () => {
    if (!recognitionRef.current) return

    // If we're already stopping or not listening, don't try to stop again
    if (isStoppingRef.current || !isListening) {
      addDebug("Already stopping or not listening, ignoring stop request")
      return
    }

    try {
      isStoppingRef.current = true
      addDebug("Attempting to stop recognition")
      recognitionRef.current.stop()
    } catch (e) {
      isStoppingRef.current = false
      addDebug(`Stop error: ${e}`)

      // If recognition wasn't running, update our state
      if (e instanceof DOMException && e.message.includes("not started")) {
        setIsListening(false)
      }
    }
  }

  // Safely restart recognition with a delay
  const safelyRestartRecognition = (delay = 1000) => {
    // Clear any existing restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }

    // Set a new timeout to restart recognition
    restartTimeoutRef.current = setTimeout(() => {
      // Only restart if we're not currently processing a command or speaking
      if (!isProcessingCommand && !isSpeaking) {
        addDebug(`Attempting to restart recognition after ${delay}ms delay`)
        safelyStartRecognition()
      } else {
        addDebug(`Skipping restart: ${isProcessingCommand ? "processing command" : "speaking"}`)
        // Try again later if we're busy
        safelyRestartRecognition(2000)
      }
    }, delay)
  }

  // Effect to pause recognition while speaking to avoid feedback loop
  useEffect(() => {
    if (isSpeaking && isListening) {
      addDebug("Pausing recognition while speaking")
      safelyStopRecognition()
    } else if (!isSpeaking && !isListening && !isProcessingCommand) {
      // Add a delay to ensure previous recognition has fully stopped
      safelyRestartRecognition(1000)
    }
  }, [isSpeaking, isListening, isProcessingCommand])

  const toggleListening = () => {
    if (isListening) {
      safelyStopRecognition()
    } else {
      safelyStartRecognition()
    }
  }

  // Process commands with strict wake word detection
  const processCommand = (command: string) => {
    // Don't process empty commands
    if (!command || command.trim() === "") return

    addDebug(`Processing command: "${command}"`)

    // Ignore commands that might be the system's own speech output
    // Use more precise patterns to avoid false positives
    if (
      (command.includes("welcome to blind") && command.includes("assist")) ||
      (command.includes("i'm listening") && command.includes("command")) ||
      (command.includes("activated") && (command.includes("walking mode") || command.includes("interaction mode")))
    ) {
      addDebug("Ignoring system speech feedback - specific pattern match")
      return
    }

    // Check if we're already in command mode or if the wake phrase was detected
    if (!wakeWordDetected) {
      // Check for wake phrase with more variations and phonetic similarity
      const wakeWords = [
        /\bhi\s+assist\s+ai\b/i,
        /\bhey\s+assist\s+ai\b/i,
        /\bhello\s+assist\s+ai\b/i,
        /\bhi\s+assistant\s+ai\b/i,
        /\bhey\s+assistant\s+ai\b/i,
        /\bhi\s+assistant\b/i,
        /\bhey\s+assistant\b/i,
        /\bhello\s+assistant\b/i,
        /\bhi\s+assist\b/i,
        /\bhey\s+assist\b/i,
      ]

      // Check if any wake word pattern matches
      const isWakeWordDetected = wakeWords.some((pattern) => command.match(pattern))

      // Also check for phonetic similarity if no exact match
      const isPhoneticMatch =
        !isWakeWordDetected &&
        (phoneticSimilarity(command, "hi assist ai") > 0.7 ||
          phoneticSimilarity(command, "hi assistant") > 0.7 ||
          phoneticSimilarity(command, "hey assist ai") > 0.7)

      if (isWakeWordDetected || isPhoneticMatch) {
        addDebug("Wake phrase detected! " + (isPhoneticMatch ? "(phonetic match)" : ""))
        setWakeWordDetected(true)
        setShowFeedback(true)
        speak("I'm listening for your command", true)
        return
      }
      // If no wake phrase and not in command mode, ignore the command
      return
    }

    // If we get here, we're in command mode after wake word detection
    setIsProcessingCommand(true)

    // Enhanced command processing with more variations and phonetic matching
    const homeCommands = [/\b(go\s+to\s+home|home\s+page|go\s+home|go\s+homepage|homepage)\b/i]
    const aboutCommands = [/\b(about|about\s+page|tell\s+about|about\s+you|tell\s+me\s+about\s+you)\b/i]
    const helpCommands = [/\b(how\s+to\s+use|help|instructions|guide|tutorial)\b/i]
    const walkingCommands = [/\b(walking|walking\s+mode|activate\s+walking|start\s+walking|working\s+mode)\b/i]
    const interactionCommands = [
      /\b(interaction|interaction\s+mode|activate\s+interaction|start\s+interaction)\b/i,
      /\b(introduction\s+mode|intraction\s+mode|induction\s+mode)\b/i,
    ]
    const deactivateCommands = [/\b(deactivate|stop\s+listening|turn\s+off|exit|quit)\b/i]

    // Function to check if command matches any pattern in the array
    const matchesAny = (patterns: RegExp[]) => patterns.some((pattern) => command.match(pattern))

    // Function to check phonetic similarity
    const checkPhoneticSimilarity = (targetPhrases: string[]) => {
      return targetPhrases.some((phrase) => phoneticSimilarity(command, phrase) > 0.6)
    }

    // Also check for simple commands like just "home" or "about"
    const simpleCommandMatch = () => {
      const simpleCommand = command.trim().toLowerCase()
      if (simpleCommand === "home") return "home"
      if (simpleCommand === "about") return "about"
      if (simpleCommand === "help" || simpleCommand === "how to use") return "help"
      if (simpleCommand === "walking" || simpleCommand === "walking mode" || simpleCommand === "working")
        return "walking"
      if (simpleCommand === "interaction" || simpleCommand === "interaction mode") return "interaction"
      return null
    }

    // Clear any existing safety timeout
    if (window.navigationTimeout) {
      clearTimeout(window.navigationTimeout)
    }

    // Replace the navigateTo function with this implementation
    const navigateTo = (path: string, message: string) => {
      speak(message, true)
      addDebug(`NAVIGATION REQUEST: ${path}`)

      // Clear any existing navigation timeouts
      if (window.navigationTimeout) {
        clearTimeout(window.navigationTimeout)
      }

      // Use a more direct approach to navigation
      window.navigationTimeout = setTimeout(() => {
        addDebug(`EXECUTING NAVIGATION TO: ${path}`)
        forceNavigation(path)

        // Reset states
        setShowFeedback(false)
        setIsProcessingCommand(false)
        setWakeWordDetected(true) // Keep wake word detection active
      }, 1000) // Reduced delay for faster response
    }

    const simpleCommand = simpleCommandMatch()

    if (
      matchesAny(homeCommands) ||
      checkPhoneticSimilarity(["go to home", "home page", "go home"]) ||
      simpleCommand === "home" ||
      command.includes("home")
    ) {
      addDebug("HOME COMMAND DETECTED")
      navigateTo("/", "Going to home page")
    } else if (
      matchesAny(aboutCommands) ||
      checkPhoneticSimilarity(["about", "about page", "tell about you"]) ||
      simpleCommand === "about" ||
      command.includes("about")
    ) {
      addDebug("ABOUT COMMAND DETECTED")
      navigateTo("/about", "Going to about page")
    } else if (
      matchesAny(helpCommands) ||
      checkPhoneticSimilarity(["how to use", "help", "instructions"]) ||
      simpleCommand === "help" ||
      command.includes("how to use")
    ) {
      addDebug("HELP COMMAND DETECTED")
      navigateTo("/how-to-use", "Going to how to use page")
    } else if (
      matchesAny(walkingCommands) ||
      checkPhoneticSimilarity(["walking mode", "working mode", "walk mode"]) ||
      simpleCommand === "walking" ||
      command.includes("walking")
    ) {
      addDebug("WALKING COMMAND DETECTED")
      navigateTo("/walking-mode", "Activating walking mode")
    } else if (
      matchesAny(interactionCommands) ||
      checkPhoneticSimilarity(["interaction mode", "introduction mode", "intraction mode", "induction mode"]) ||
      simpleCommand === "interaction" ||
      command.includes("interaction") ||
      command.includes("introduction")
    ) {
      addDebug("INTERACTION COMMAND DETECTED")
      navigateTo("/interaction-mode", "Activating interaction mode")
    } else if (
      matchesAny(deactivateCommands) ||
      checkPhoneticSimilarity(["deactivate", "stop listening", "turn off"])
    ) {
      speak("Deactivating voice assistant", true)
      addDebug("Command: deactivate")
      setTimeout(() => {
        setWakeWordDetected(false)
        setShowFeedback(false)
        setIsProcessingCommand(false)
      }, 1500)
    } else {
      // If no command matched, provide feedback and keep wake word active
      speak("I didn't understand that command. Please try again.", true)
      addDebug("Command not recognized: " + command)
      setTimeout(() => {
        setIsProcessingCommand(false)
        // Keep wake word active
        setWakeWordDetected(true)
      }, 1500)
    }

    // Add a safety timeout to ensure we don't get stuck in processing state
    window.safetyTimeout = setTimeout(() => {
      if (isProcessingCommand) {
        addDebug("Safety timeout: Resetting processing state")
        setIsProcessingCommand(false)
      }
    }, 5000)
  }

  // Update the manual activation button handler
  const handleManualActivate = () => {
    setShowFeedback(true)
    setWakeWordDetected(true)
    speak("I'm listening for commands", true)
  }

  // Start listening automatically when component mounts
  useEffect(() => {
    let startupTimer: NodeJS.Timeout
    let safetyTimeout: NodeJS.Timeout

    // Add a global command handler for debugging
    if (typeof window !== "undefined") {
      ;(window as any).executeVoiceCommand = (command: string) => {
        addDebug(`Manual command execution: ${command}`)
        setWakeWordDetected(true)
        processCommand(command)
      }
    }

    // Try to start recognition multiple times to ensure it starts
    const attemptStart = (attempt = 1) => {
      addDebug(`Auto-start attempt ${attempt}`)
      safelyStartRecognition()

      // Check if it actually started after a delay
      setTimeout(() => {
        if (!isListening && attempt < 3) {
          addDebug(`Auto-start failed, retrying (attempt ${attempt + 1})`)
          attemptStart(attempt + 1)
        }
      }, 1500)
    }

    // Delay initial start to ensure everything is loaded
    startupTimer = setTimeout(() => {
      attemptStart()
      // Force wake word detection to be active from the start
      setWakeWordDetected(true)
      speak("Voice assistant is ready", true)
    }, 2000)

    return () => {
      clearTimeout(startupTimer)
      clearTimeout(safetyTimeout)
      // Clean up global command handler
      if (typeof window !== "undefined") {
        ;(window as any).executeVoiceCommand = undefined
      }
    }
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
      {(showFeedback || isSpeaking || wakeWordDetected) && (
        <Card className="fixed top-4 right-4 z-50 w-80 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Mic className={`h-4 w-4 mr-2 ${isListening ? "text-green-500" : "text-gray-500"}`} />
                <span className="font-medium">
                  {isListening
                    ? wakeWordDetected
                      ? "Listening for commands..."
                      : "Waiting for 'Hi Assist AI'..."
                    : isSpeaking
                      ? "Speaking..."
                      : "Ready"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setShowFeedback(false)
                  setWakeWordDetected(false)
                }}
              >
                ×
              </Button>
            </div>

            <div className="bg-gray-100 p-2 rounded text-sm min-h-[40px] mb-2">{transcript || "Say something..."}</div>

            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

            <div className="text-xs text-gray-500 mt-1">
              {wakeWordDetected
                ? "Now say your command (e.g., 'go to walking mode')"
                : "Say 'Hi Assist AI' to activate"}
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

