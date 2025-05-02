"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Users,
  Info,
  HelpCircle,
  Volume2,
  Bug,
  Zap,
  CheckCircle,
  Lightbulb,
  Award,
  GroupIcon as TeamIcon,
} from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import Link from "next/link"
import VoiceAssistant from "@/components/voice-assistant"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const { speak } = useSpeech()
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Welcome message when the page loads
    const welcomeMessage =
      "Welcome to Blind Assist AI. Your personal navigation and interaction assistant. Say 'Hi Assist AI' or 'Hi Assistant AI' followed by a command like 'go to walking mode' or 'how to use'."

    // Small delay to ensure speech synthesis is ready
    const timer = setTimeout(() => {
      speak(welcomeMessage, true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [speak])

  const handleDebugClick = () => {
    setShowDebug(!showDebug)
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <VoiceAssistant />

      {/* Header Section with 3D effect */}
      <section className="mb-10 text-center relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo.svg" alt="Blind Assist AI Logo" width={150} height={150} className="my-4" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Blind Assist AI</h1>
          <p className="text-xl mb-6">Your Personal Navigation & Interaction Assistant</p>
          <Separator className="my-6 bg-white/20" />
        </div>
      </section>

      {/* Voice Assistant Status */}
      <section className="mb-10">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              <Volume2 className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Voice Assistant Status: Always Listening</h2>
                <p className="mb-3">
                  Say: <strong>"Hi Assist AI"</strong> followed by commands such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>"Go to Walking Mode"</li>
                  <li>"Go to Interaction Mode"</li>
                  <li>"About Page"</li>
                  <li>"How to Use"</li>
                  <li>"Go to Home Page"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-2 text-amber-500" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Link href="/walking-mode">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 h-full overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl"></div>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <Eye className="h-10 w-10 text-blue-600 mb-3" />
                <span className="text-lg font-medium text-center">Walking Mode</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/interaction-mode">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-full overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-200/30 blur-3xl"></div>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <Users className="h-10 w-10 text-purple-600 mb-3" />
                <span className="text-lg font-medium text-center">Interaction Mode</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/about">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200 h-full overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-200/30 blur-3xl"></div>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <Info className="h-10 w-10 text-green-600 mb-3" />
                <span className="text-lg font-medium text-center">About</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/how-to-use">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 h-full overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl"></div>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <HelpCircle className="h-10 w-10 text-amber-600 mb-3" />
                <span className="text-lg font-medium text-center">How to Use</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/documentation">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 h-full overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-200/30 blur-3xl"></div>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <FileText className="h-10 w-10 text-indigo-600 mb-3" />
                <span className="text-lg font-medium text-center">Documentation</span>
              </CardContent>
            </Card>
          </Link>

          <Card
            className="hover:shadow-lg transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-red-50 to-red-100 border-red-200 h-full cursor-pointer overflow-hidden relative"
            onClick={handleDebugClick}
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-200/30 blur-3xl"></div>
            <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
              <Bug className="h-10 w-10 text-red-600 mb-3" />
              <span className="text-lg font-medium text-center">Debug Help</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Debug Panel */}
      {showDebug && (
        <section className="mb-10">
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-200/30 blur-3xl"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center">
                <Bug className="h-5 w-5 mr-2 text-red-500" />
                Debug Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => speak("Testing speech synthesis", true)}
                  variant="outline"
                  className="bg-white hover:bg-white/80 transition-all"
                >
                  Test Speech
                </Button>
                <Button
                  onClick={() => {
                    try {
                      window.location.href = "/"
                    } catch (e) {
                      console.error("Navigation error:", e)
                    }
                  }}
                  variant="outline"
                  className="bg-white hover:bg-white/80 transition-all"
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
                  variant="outline"
                  className="bg-white hover:bg-white/80 transition-all"
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
                  variant="outline"
                  className="bg-white hover:bg-white/80 transition-all"
                >
                  Test Audio API
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-green-500" />
          Why Choose Us?
        </h2>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-200/30 blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <p className="mb-4 text-lg">Empowering independence with cutting-edge AI:</p>
            <ul className="space-y-3">
              {[
                "Real-time obstacle and people detection",
                "Hands-free operation with voice control",
                "Designed for inclusivity and accessibility",
                "Developed by a passionate team for Solution Challenge 2025",
                "Built with a mission to enhance daily life for the visually impaired",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Pro Tips Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-amber-500" />
          Pro Tips for Best Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tip: "Hold your device at chest height", icon: <Eye className="h-8 w-8 text-blue-500" /> },
            { tip: "Use in well-lit environments", icon: <Lightbulb className="h-8 w-8 text-amber-500" /> },
            { tip: "Ensure volume is turned up", icon: <Volume2 className="h-8 w-8 text-green-500" /> },
            { tip: "Speak commands clearly and naturally", icon: <Mic className="h-8 w-8 text-purple-500" /> },
          ].map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-slate-200/30 blur-3xl"></div>
              <CardContent className="p-4 flex items-center gap-4 relative z-10">
                {item.icon}
                <p className="font-medium">{item.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TeamIcon className="h-6 w-6 mr-2 text-purple-500" />
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Krish Bhagat", role: "AI/ML & FastAPI Developer" },
            { name: "Krishna Jagtap", role: "Frontend Developer" },
            { name: "Sahil Sharma", role: "Frontend Developer" },
            { name: "Ritik Pawar", role: "Research & Dataset Creator" },
          ].map((member, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all hover:-translate-y-1 duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-200/30 blur-3xl"></div>
              <CardContent className="p-4 relative z-10">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Solution Challenge Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-amber-500" />
          Solution Challenge 2025
        </h2>
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <p className="text-lg">
              Our submission focuses on accessibility solutions for visually impaired individuals, under SDG Goal #10:
              Reduced Inequalities.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Debug toggle button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDebugClick}
          className="bg-white opacity-50 hover:opacity-100 hover:shadow-md transition-all"
        >
          <Bug className="h-4 w-4" />
        </Button>
      </div>
    </main>
  )
}

function Mic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
