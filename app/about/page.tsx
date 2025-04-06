"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"
import Image from "next/image"

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

      <div className="flex justify-center mb-6">
        <Image src="/images/logo.svg" alt="Blind Assist AI Logo" width={100} height={100} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">About Blind Assist AI</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Blind Assist AI is designed to help visually impaired individuals navigate their surroundings and interact
            with people more confidently. Our mission is to make the world more accessible through AI-powered
            assistance.
          </p>
          <p>
            This application is made for Solution Challenge 2025 as a Minimum Viable Product for the open challenge.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Our Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Krish Bhagat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">AI ML Developer and Fast API Developer</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Krishna Jagtap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Frontend Developer</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Sahil Sharma</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Frontend Developer</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Ritik Pawar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Researcher and Dataset Creator</p>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solution Challenge 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This project is our submission for the Solution Challenge 2025, addressing accessibility challenges for
            visually impaired individuals through innovative AI technology.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

