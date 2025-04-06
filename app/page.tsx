"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, Info, HelpCircle, HomeIcon, Volume2, Bug } from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import Link from "next/link"
import VoiceAssistant from "@/components/voice-assistant"
import Image from "next/image"

export default function Home() {
  const { speak } = useSpeech()
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Welcome message when the page loads
    const welcomeMessage =
      "Welcome to Blind Assist AI. Your personal navigation and interaction assistant. Say Hi Assist AI to activate voice commands."

    // Small delay to ensure speech synthesis is ready
    const timer = setTimeout(() => {
      speak(welcomeMessage, true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [speak])

  const handleDebugClick = () => {
    setShowDebug(!showDebug)
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <VoiceAssistant />

      <div className="flex justify-center mb-6">
        <Image src="/images/logo.svg" alt="Blind Assist AI Logo" width={150} height={150} className="my-4" />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Blind Assist AI</h1>
      <p className="text-center mb-8 text-lg">Your personal navigation and interaction assistant</p>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center">
        <Volume2 className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
        <p>
          Voice assistant is always listening. Say <strong>"Hi Assist AI"</strong> to activate, then speak your command
          like <strong>"go to walking mode"</strong> or <strong>"about page"</strong>.
        </p>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Panel</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => speak("Testing speech synthesis", true)}>Test Speech</Button>
            <Button
              onClick={() => {
                try {
                  window.location.href = "/"
                } catch (e) {
                  console.error("Navigation error:", e)
                }
              }}
            >
              Test Navigation
            </Button>
            <Button
              onClick={() => {
                try {
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                  if (SpeechRecognition) {
                    alert("Speech Recognition API is available")
                  } else {
                    alert("Speech Recognition API is NOT available")
                  }
                } catch (e) {
                  alert("Error checking Speech API: " + e)
                }
              }}
            >
              Check Speech API
            </Button>
            <Button
              onClick={() => {
                try {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                  const oscillator = audioContext.createOscillator()
                  oscillator.connect(audioContext.destination)
                  oscillator.start()
                  oscillator.stop(audioContext.currentTime + 0.5)
                  alert("Audio API works")
                } catch (e) {
                  alert("Audio API error: " + e)
                }
              }}
            >
              Test Audio API
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link href="/walking-mode">
              <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
                <Eye className="h-10 w-10" />
                <span className="text-lg font-medium">Walking Mode</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link href="/interaction-mode">
              <Button variant="outline" className="w-full h-32 flex flex-col gap-2">
                <Users className="h-10 w-10" />
                <span className="text-lg font-medium">Interaction Mode</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link href="/about">
              <Button variant="ghost" className="w-full h-24 flex flex-col gap-2">
                <Info className="h-6 w-6" />
                <span className="font-medium">About</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link href="/">
              <Button variant="ghost" className="w-full h-24 flex flex-col gap-2">
                <HomeIcon className="h-6 w-6" />
                <span className="font-medium">Home</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Link href="/how-to-use">
              <Button variant="ghost" className="w-full h-24 flex flex-col gap-2">
                <HelpCircle className="h-6 w-6" />
                <span className="font-medium">How to Use</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Debug toggle button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDebugClick}
          className="bg-white opacity-50 hover:opacity-100"
        >
          <Bug className="h-4 w-4" />
        </Button>
      </div>
    </main>
  )
}

