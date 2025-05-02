"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import InteractionMode from "@/components/interaction-mode"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"

export default function InteractionModePage() {
  const { speak } = useSpeech()

  useEffect(() => {
    // Announce when interaction mode is activated
    const interactionModeMessage =
      "Interaction mode activated. The system will detect people around you and announce their distance and position."
    speak(interactionModeMessage, true)
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

      <h1 className="text-3xl font-bold mb-6 text-center">Interaction Mode</h1>
      <p className="text-center mb-6 text-gray-600">Detecting people around you</p>

      <InteractionMode />
    </main>
  )
}
