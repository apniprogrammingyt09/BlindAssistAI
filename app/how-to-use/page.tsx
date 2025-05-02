"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Eye,
  Users,
  Mic,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"
import { Separator } from "@/components/ui/separator"

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

      {/* Header Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">How to Use Blind Assist AI</h1>
        <p className="text-xl text-gray-600">A comprehensive guide to getting the most out of your assistant</p>
        <Separator className="my-6" />
      </section>

      {/* Voice Commands Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Mic className="h-6 w-6 mr-2 text-purple-600" />
          Start with Voice Commands
        </h2>
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Volume2 className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Say: "Hi Assist AI" followed by a command</h3>
                <p className="mb-3">Examples:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>"Go to Walking Mode"</li>
                  <li>"Go to Interaction Mode"</li>
                  <li>"Tell About You"</li>
                  <li>"How to Use"</li>
                  <li>"Go to Home Page"</li>
                </ul>
                <div className="bg-purple-50 p-3 rounded-md flex items-start">
                  <Lightbulb className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Voice assistant is always active. Speak clearly and naturally.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Walking Mode Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Eye className="h-6 w-6 mr-2 text-blue-600" />
          Walking Mode — Navigate Safely
        </h2>
        <Card className="mb-6 border-blue-200">
          <CardContent className="p-6">
            <ol className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <span>Automatically activates the camera</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <span>Detects obstacles and their positions: Left | Center | Right</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <span>Provides voice alerts about nearby obstacles</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  4
                </div>
                <span>Different alert tones signal how close the object is</span>
              </li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-red-50 p-3 rounded-md flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mb-2"></div>
                <span className="font-medium text-red-700">Urgent (very close)</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-md flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 mb-2"></div>
                <span className="font-medium text-amber-700">Caution (medium distance)</span>
              </div>
              <div className="bg-green-50 p-3 rounded-md flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mb-2"></div>
                <span className="font-medium text-green-700">Safe (clear path)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interaction Mode Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2 text-purple-600" />
          Interaction Mode — Detect People Around You
        </h2>
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <span>Activates the camera</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <span>Detects number of people around you</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <span>Announces each person's position and exact distance (in cm)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  4
                </div>
                <span>Special alerts for close proximity</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Troubleshooting Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-amber-500" />
          If Something Doesn't Work
        </h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Try these troubleshooting tips:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                'Use the "Activate Assistant" button manually',
                "Ensure microphone and camera permissions are ON",
                "Raise volume to hear alerts",
                "Use in bright, well-lit environments",
              ].map((tip, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Tips for Best Performance */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-2 text-blue-500" />
          Tips for Best Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tip: "Hold your device at chest level", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            { tip: "Move at a normal walking pace", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            { tip: "Keep your device charged", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
            {
              tip: "Use a stable internet connection for updates",
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            },
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                {item.icon}
                <p>{item.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Common Mistakes to Avoid */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <XCircle className="h-6 w-6 mr-2 text-red-500" />
          Common Mistakes to Avoid
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Covering the camera while using detection modes",
            "Speaking too quietly for voice commands",
            "Using in extremely dark environments",
            "Moving too quickly for accurate detection",
          ].map((mistake, index) => (
            <Card key={index} className="hover:shadow-md transition-all border-red-100">
              <CardContent className="p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p>{mistake}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
