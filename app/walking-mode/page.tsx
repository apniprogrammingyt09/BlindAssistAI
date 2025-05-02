"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import WalkingMode from "@/components/walking-mode"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"

export default function WalkingModePage() {
  const { speak } = useSpeech()

  useEffect(() => {
    // Announce when walking mode is activated
    const walkingModeMessage =
      "Walking mode activated. The system will detect obstacles in your path and provide voice alerts."
    speak(walkingModeMessage, true)
  }, [speak])

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <VoiceAssistant />

      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Walking Mode</h1>
      <p className="text-center mb-6 text-gray-600">Detecting obstacles in your path</p>

      <WalkingMode />
    </main>
  )
}
