"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      setIsSpeechSupported(isSupported)

      if (isSupported) {
        addLog("Speech recognition is supported in this browser")
      } else {
        addLog("Speech recognition is NOT supported in this browser")
      }
    }

    // Override console.log to capture voice assistant logs
    const originalLog = console.log
    console.log = (...args) => {
      originalLog(...args)
      if (args[0] === "Voice Assistant:") {
        addLog(args.join(" "))
      }
    }

    return () => {
      console.log = originalLog
    }
  }, [])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-10))
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const testSpeech = () => {
    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI()
        recognition.onstart = () => addLog("Test: Speech recognition started")
        recognition.onend = () => addLog("Test: Speech recognition ended")
        recognition.onerror = (e: any) => addLog(`Test: Speech recognition error: ${e.error}`)
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript
          addLog(`Test: Heard "${transcript}"`)
        }
        recognition.start()
        setTimeout(() => recognition.stop(), 5000)
      }
    } catch (error) {
      addLog(`Test error: ${error}`)
    }
  }

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 opacity-30 hover:opacity-100"
        onClick={toggleVisibility}
      >
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80 max-h-96 overflow-auto shadow-lg">
      <CardHeader className="py-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <span>Voice Assistant Debug</span>
          <Button variant="ghost" size="sm" onClick={toggleVisibility}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 text-xs">
        <div className="mb-2 flex gap-2">
          <Button size="sm" onClick={testSpeech} disabled={!isSpeechSupported}>
            <Mic className="h-3 w-3 mr-1" /> Test Mic
          </Button>
          <div className={`px-2 py-1 rounded ${isSpeechSupported ? "bg-green-100" : "bg-red-100"}`}>
            {isSpeechSupported ? "Speech API Available" : "Speech API Not Available"}
          </div>
        </div>
        <div className="border rounded p-2 h-40 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs yet</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
        <p className="mt-2 text-gray-500">Say "Hi Assist AI" or "Hi Assistant AI" to activate</p>
      </CardContent>
    </Card>
  )
}
