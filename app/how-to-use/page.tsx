"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Users, Mic, Volume2 } from "lucide-react"
import Link from "next/link"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"

export default function HowToUse() {
  const { speak } = useSpeech()

  useEffect(() => {
    // Read the how to use content when loaded
    const howToUseContent = `
How to use Blind Assist AI.
Our application has two main modes: Walking Mode and Interaction Mode.
Walking Mode helps you detect obstacles in your path and provides voice alerts.
Interaction Mode detects people around you and announces their distance and position.
You can navigate through the app using voice commands directly.
Always start with the wake phrase "Hi Assist AI" followed by your command.
Available commands include: Go to Home Page, Tell About You, How to Use, Walking Mode, and Interaction Mode.
`
    speak(howToUseContent)
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

      <h1 className="text-3xl font-bold mb-6 text-center">How to Use Blind Assist AI</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            First say the wake phrase <strong>"Hi Assist AI"</strong> to activate the assistant, then speak your
            command:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>"Go to Home Page"</strong> - Navigate to the home page
            </li>
            <li>
              <strong>"Tell About You"</strong> - Learn about the application
            </li>
            <li>
              <strong>"How to Use"</strong> - Get usage instructions
            </li>
            <li>
              <strong>"Walking Mode"</strong> - Start obstacle detection
            </li>
            <li>
              <strong>"Interaction Mode"</strong> - Start people detection
            </li>
          </ul>
          <p className="mt-4">
            Alternatively, you can use the "Activate Assistant" button in the bottom right corner of the screen.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Walking Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Walking Mode helps you navigate by detecting obstacles in your path.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The camera automatically activates when you enter this mode</li>
              <li>The system detects obstacles and their positions (left, center, right)</li>
              <li>Voice alerts inform you about obstacles and their proximity</li>
              <li>Different alert tones indicate the urgency based on obstacle distance</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Interaction Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Interaction Mode helps you identify people around you.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The camera automatically activates when you enter this mode</li>
              <li>The system detects people and their positions (left, center, right)</li>
              <li>Voice announcements inform you about the number of people and their exact distance in centimeters</li>
              <li>Special alerts for when people are very close to you</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hold your device at chest height for optimal detection</li>
            <li>Speak clearly when using voice commands</li>
            <li>Use in well-lit environments for better detection accuracy</li>
            <li>Ensure your device's volume is turned up to hear the voice alerts</li>
            <li>The system works best when moving at a walking pace</li>
            <li>If voice commands aren't working, use the manual "Activate Assistant" button</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}

