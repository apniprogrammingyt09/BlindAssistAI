"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Github,
  Linkedin,
  Target,
  Users,
  Award,
  CheckCircle,
  Quote,
  Sparkles,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export default function About() {
  const { speak } = useSpeech()

  useEffect(() => {
    // Read the about page content when loaded
    const aboutContent = `
  About Blind Assist AI. 
  This application is made for Solution Challenge 2025 as a Minimum Viable Product for the open challenge.
  The development team includes:
  Krish Bhagat, AI ML developer and Fast API developer.
  Krishna Jagtap, frontend developer.
  Sahil Sharma, frontend developer.
  Ritik Pawar, researcher and dataset creator.
  You can use voice commands directly to navigate the app.
`
    speak(aboutContent)
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
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.svg" alt="Blind Assist AI Logo" width={120} height={120} />
        </div>
        <h1 className="text-4xl font-bold mb-3">About Blind Assist AI</h1>
        <p className="text-xl text-gray-600">Empowering the Visually Impaired with AI Technology</p>
        <Separator className="my-6" />
      </section>

      {/* Our Mission Section */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We aim to create an inclusive world by enabling visually impaired individuals to navigate and interact
              independently using real-time, AI-driven assistance.
            </p>
            <p>
              Blind Assist AI is a Minimum Viable Product (MVP) developed for Google's Solution Challenge 2025, under
              SDG Goal #10: Reduced Inequalities.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* What is Blind Assist AI Section */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              What is Blind Assist AI?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">An intelligent, voice-controlled mobile system that offers:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>🚶‍♂️ Walking Mode for obstacle detection</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>🧍 Interaction Mode for identifying people nearby</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>🎙️ Always-on voice command system</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Meet the Team Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2 text-purple-600" />
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Krish Bhagat", role: "AI/ML Developer & FastAPI Backend" },
            { name: "Krishna Jagtap", role: "Frontend Developer" },
            { name: "Sahil Sharma", role: "Frontend Developer" },
            { name: "Ritik Pawar", role: "Researcher & Dataset Creator" },
          ].map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">{member.role}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
          Our Impact
        </h2>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <Quote className="h-8 w-8 text-gray-400 flex-shrink-0" />
              <p className="text-lg italic text-gray-600">"Technology is best when it brings people together."</p>
            </div>
            <p className="mb-4">Here's how Blind Assist AI is already making a difference:</p>
            <ul className="space-y-3">
              {[
                "Tested with users from accessibility communities",
                "Improved confidence in independent navigation",
                "Enabled smoother interaction in crowded or unfamiliar spaces",
                "Inspired further ideas for smart glasses integration",
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

      {/* About the Challenge Section */}
      <section className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              About the Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This project is part of Google Solution Challenge 2025, focusing on solving real-world accessibility
              issues using modern technology and innovation.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Future Vision Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-blue-500" />
          Future Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "Smart Glasses with AI",
            "Indoor navigation with beacon support",
            "Voice personalization and language support",
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-all bg-gradient-to-b from-blue-50 to-transparent">
              <CardContent className="p-4 flex items-center justify-center h-32 text-center">
                <p className="font-medium">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
