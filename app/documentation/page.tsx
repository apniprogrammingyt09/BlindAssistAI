"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Server, Cpu, Layers, Zap, Github } from "lucide-react"
import Link from "next/link"
import { useSpeech } from "@/hooks/use-speech"
import VoiceAssistant from "@/components/voice-assistant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Documentation() {
  const { speak } = useSpeech()
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  useEffect(() => {
    // Read the documentation page content when loaded
    const docContent = `
      Welcome to the Blind Assist AI documentation page. 
      This page contains technical information about the project architecture, implementation details, and deployment instructions.
    `
    speak(docContent)
  }, [speak])

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <VoiceAssistant />

      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      {/* Header with 3D effect */}
      <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Blind Assist AI Documentation</h1>
          <p className="text-xl text-white/80">Technical specifications and implementation details</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              Version 1.0
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              Solution Challenge 2025
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="https://github.com" className="flex items-center gap-1">
                <Github className="h-3 w-3" /> GitHub
              </Link>
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="py-4">
          <div className="grid gap-6">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Project Overview</CardTitle>
                <CardDescription>
                  Blind Assist AI is an AI-powered solution designed to assist visually impaired individuals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Blind Assist AI is a deep learning-powered solution that empowers visually impaired users with
                  enhanced situational awareness and seamless mobility. It combines real-time object detection,
                  voice-based interaction, and multi-mode intelligence to provide a safer, smarter navigation
                  experience.
                </p>

                <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <h3 className="mb-2 text-lg font-semibold text-blue-700 dark:text-blue-300">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Real-time obstacle detection and distance estimation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Voice-controlled interface for hands-free operation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Dual modes: Walking Mode and Interaction Mode</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Works on standard devices without specialized hardware</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4 transition-transform hover:-translate-y-1 dark:from-purple-900/30 dark:to-purple-800/30">
                    <h3 className="mb-2 text-lg font-semibold text-purple-700 dark:text-purple-300">Walking Mode</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Detects obstacles like vehicles, stairs, walls, and other objects in the user's path, providing
                      real-time voice alerts with distance and direction information.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-4 transition-transform hover:-translate-y-1 dark:from-amber-900/30 dark:to-amber-800/30">
                    <h3 className="mb-2 text-lg font-semibold text-amber-700 dark:text-amber-300">Interaction Mode</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Identifies and localizes people around the user (left, right, center), helping users engage
                      confidently in social settings with enhanced awareness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Why It's Better</CardTitle>
                <CardDescription>Advantages over existing solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:shadow-md dark:from-green-900/30 dark:to-emerald-900/30">
                    <h3 className="mb-2 text-lg font-semibold text-green-700 dark:text-green-300">
                      Real-Time Environment Scanning
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Detects and understands obstacles and people, providing precise distance and direction using deep
                      learning.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 p-4 transition-all hover:shadow-md dark:from-blue-900/30 dark:to-sky-900/30">
                    <h3 className="mb-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                      Voice-Assisted Interface
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Intuitive and touch-free interaction, ensuring ease of use for the visually impaired.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 p-4 transition-all hover:shadow-md dark:from-indigo-900/30 dark:to-violet-900/30">
                    <h3 className="mb-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                      No Special Hardware
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Works on any device with a camera—no need for expensive wearables or sensors.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 p-4 transition-all hover:shadow-md dark:from-rose-900/30 dark:to-pink-900/30">
                    <h3 className="mb-2 text-lg font-semibold text-rose-700 dark:text-rose-300">
                      Overcomes Existing Limitations
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Addresses gaps in GPS-based apps, smart canes, and sensor wearables with real-time dynamic
                      obstacle tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="py-4">
          <div className="grid gap-6">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Technical Architecture</CardTitle>
                <CardDescription>System components and technology stack</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 p-6 dark:from-slate-800 dark:to-slate-900">
                  <h3 className="mb-4 text-xl font-semibold">System Architecture</h3>
                  <div className="relative mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 p-3 dark:from-blue-900/40 dark:to-blue-800/40">
                        <span className="font-medium">User Interface (Next.js)</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-8 w-0.5 bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 p-3 dark:from-purple-900/40 dark:to-purple-800/40">
                        <span className="font-medium">API Layer (FastAPI)</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-8 w-0.5 bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-green-100 to-green-50 p-3 dark:from-green-900/40 dark:to-green-800/40">
                          <span className="font-medium">AI Models (YOLOv8)</span>
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-100 to-amber-50 p-3 dark:from-amber-900/40 dark:to-amber-800/40">
                          <span className="font-medium">Voice Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                          <Layers className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">Frontend</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge>Next.js</Badge>
                          <span>React framework</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>Tailwind CSS</Badge>
                          <span>Styling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>React Context</Badge>
                          <span>State management</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                          <Server className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">Backend</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge>FastAPI</Badge>
                          <span>Python API framework</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>WebSockets</Badge>
                          <span>Real-time communication</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>Docker</Badge>
                          <span>Containerization</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/50 dark:text-green-300">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">AI & ML</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge>YOLOv8</Badge>
                          <span>Object detection</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>OpenCV</Badge>
                          <span>Image processing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>PyTorch</Badge>
                          <span>Deep learning</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold">Technology Stack</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-4 dark:from-slate-800 dark:to-slate-900">
                      <h4 className="mb-2 font-semibold">AI & Computer Vision</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">YOLOv8 (Ultralytics)</Badge>
                          <span>Real-time object detection</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">OpenCV</Badge>
                          <span>Video processing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Torch & TensorFlow</Badge>
                          <span>Model execution</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-4 dark:from-slate-800 dark:to-slate-900">
                      <h4 className="mb-2 font-semibold">Voice Assistance</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Gemini API</Badge>
                          <span>Voice interaction</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Text-to-Speech</Badge>
                          <span>Spoken feedback</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Speech-to-Text</Badge>
                          <span>Voice commands</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-4 dark:from-slate-800 dark:to-slate-900">
                      <h4 className="mb-2 font-semibold">Deployment & Cloud</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Hugging Face Spaces</Badge>
                          <span>AI model hosting</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Vercel</Badge>
                          <span>Frontend hosting</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Docker</Badge>
                          <span>Containerization</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-4 dark:from-slate-800 dark:to-slate-900">
                      <h4 className="mb-2 font-semibold">Frontend</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Next.js</Badge>
                          <span>React framework</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Tailwind CSS</Badge>
                          <span>Utility-first CSS</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">React Context API</Badge>
                          <span>State management</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Implementation Tab */}
        <TabsContent value="implementation" className="py-4">
          <div className="grid gap-6">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Implementation Details</CardTitle>
                <CardDescription>How the system is built and functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-6">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        1
                      </div>
                      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">AI Model Development</h3>
                    </div>
                    <div className="ml-11 space-y-4">
                      <div>
                        <h4 className="mb-1 font-semibold">Object Detection Model</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Using YOLOv8, the AI model is trained to detect obstacles in real-time. It processes video
                          frames captured by the device's camera, analyzing objects like vehicles, walls, stairs, and
                          other potential obstacles.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">Distance Estimation</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          The model estimates the distance of detected objects in centimeters using depth estimation
                          techniques, allowing for accurate voice feedback when objects are close.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">People Recognition</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          In Interaction Mode, the model identifies faces and people, detecting their location (left,
                          right, center) and providing real-time distance information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 p-6 dark:from-purple-900/30 dark:to-violet-900/30">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                        2
                      </div>
                      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                        Voice-Based Interaction
                      </h3>
                    </div>
                    <div className="ml-11 space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        The Gemini API enables hands-free interaction. Users can speak commands like "Go to Walking
                        Mode" or "Tell About You," and the system responds with appropriate actions.
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                          <h4 className="mb-1 font-semibold">Speech-to-Text</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Voice commands are converted into text for processing by the backend.
                          </p>
                        </div>
                        <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                          <h4 className="mb-1 font-semibold">Text-to-Speech</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            System responses and alerts are converted to speech for the user.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:from-amber-900/30 dark:to-orange-900/30">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
                        3
                      </div>
                      <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300">
                        Real-Time Communication
                      </h3>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        WebSocket or Socket.IO provides low-latency communication between the AI backend and the web
                        interface, enabling real-time updates and feedback to the user.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-900/30 dark:to-emerald-900/30">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300">
                        4
                      </div>
                      <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">Cloud Deployment</h3>
                    </div>
                    <div className="ml-11">
                      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                        Hugging Face Spaces hosts AI models, while the frontend is deployed on Vercel. Docker ensures
                        easy deployment and scaling of the backend on any platform.
                      </p>
                      <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
                        <h4 className="mb-1 font-semibold">Deployment Architecture</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded bg-slate-100 p-2 text-center dark:bg-slate-700">
                            <p className="font-medium">Frontend</p>
                            <p className="text-slate-500 dark:text-slate-400">Vercel</p>
                          </div>
                          <div className="rounded bg-slate-100 p-2 text-center dark:bg-slate-700">
                            <p className="font-medium">API</p>
                            <p className="text-slate-500 dark:text-slate-400">FastAPI</p>
                          </div>
                          <div className="rounded bg-slate-100 p-2 text-center dark:bg-slate-700">
                            <p className="font-medium">AI Models</p>
                            <p className="text-slate-500 dark:text-slate-400">Hugging Face</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-6 dark:from-slate-800 dark:to-slate-900">
                  <h3 className="mb-4 text-xl font-semibold">Code Implementation</h3>
                  <div className="mb-4 rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Walking Mode FastApi Code</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-slate-400 hover:text-white"
                        onClick={() =>
                          copyToClipboard(
                            `from fastapi import FastAPI, File, UploadFile, HTTPException
import cv2
import numpy as np
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# Load YOLOv8 Nano model
model = YOLO("yolov8n.pt")

WALKING_OBSTACLES = [
    "car", "bus", "truck", "person", "dog", "bicycle", "motorbike",
    "traffic light", "stop sign", "construction barrier", "wall",
    "pole", "rail track", "stairs"
]

previous_obstacles = {}  # Stores last detected obstacles


@app.post("/detect")
async def detect_obstacles(file: UploadFile = File(...)):
    global previous_obstacles
    
    try:
        # Read image file
        image_bytes = await file.read()
        image_np = np.array(Image.open(io.BytesIO(image_bytes)))

        # Convert to correct format
        frame = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        frame = cv2.resize(frame, (640, 480))  # Resize for speed

        # Run YOLO model
        results = model(frame, conf=0.4)
        current_obstacles = {}

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0].item()
                label = result.names[int(box.cls[0])]

                if label in WALKING_OBSTACLES and conf > 0.4:
                    width, height = x2 - x1, y2 - y1
                    object_center = (x1 + x2) // 2
                    frame_center = frame.shape[1] // 2

                    if width * height < 5000:  # Ignore small (far) objects
                        continue

                    # Determine distance based on bounding box size
                    if width * height < 15000:
                        distance = "Far"
                    elif width * height < 30000:
                        distance = "Medium"
                    else:
                        distance = "Near"

                    # Determine position relative to frame center
                    if object_center < frame_center - 100:
                        position = "Left"
                    elif object_center > frame_center + 100:
                        position = "Right"
                    else:
                        position = "Center"
                    
                    current_obstacles[label] = {"distance": distance, "position": position}

        # Compare with previous frame detections
        changes = {}

        for obj, details in current_obstacles.items():
            prev_details = previous_obstacles.get(obj)
            if prev_details is None or prev_details != details:
                changes[obj] = details  # Object detected or changed

        for obj in previous_obstacles:
            if obj not in current_obstacles:
                changes[obj] = {"status": "Removed"}  # Object removed

        # If there are changes, update and return response
        if changes:
            previous_obstacles = current_obstacles.copy()
            
            return {"detected_changes": changes}

        return {}  # Return empty if no changes detected

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
`,
                            "yolo-code",
                          )
                        }
                      >
                        {copiedSection === "yolo-code" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Copy className="mr-1 h-3 w-3" />
                        )}
                        {copiedSection === "yolo-code" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto">
                      <code>
                        {`from fastapi import FastAPI, File, UploadFile, HTTPException
import cv2
import numpy as np
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# Load YOLOv8 Nano model
model = YOLO("yolov8n.pt")

WALKING_OBSTACLES = [
    "car", "bus", "truck", "person", "dog", "bicycle", "motorbike",
    "traffic light", "stop sign", "construction barrier", "wall",
    "pole", "rail track", "stairs"
]

previous_obstacles = {}  # Stores last detected obstacles


@app.post("/detect")
async def detect_obstacles(file: UploadFile = File(...)):
    global previous_obstacles
    
    try:
        # Read image file
        image_bytes = await file.read()
        image_np = np.array(Image.open(io.BytesIO(image_bytes)))

        # Convert to correct format
        frame = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        frame = cv2.resize(frame, (640, 480))  # Resize for speed

        # Run YOLO model
        results = model(frame, conf=0.4)
        current_obstacles = {}

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0].item()
                label = result.names[int(box.cls[0])]

                if label in WALKING_OBSTACLES and conf > 0.4:
                    width, height = x2 - x1, y2 - y1
                    object_center = (x1 + x2) // 2
                    frame_center = frame.shape[1] // 2

                    if width * height < 5000:  # Ignore small (far) objects
                        continue

                    # Determine distance based on bounding box size
                    if width * height < 15000:
                        distance = "Far"
                    elif width * height < 30000:
                        distance = "Medium"
                    else:
                        distance = "Near"

                    # Determine position relative to frame center
                    if object_center < frame_center - 100:
                        position = "Left"
                    elif object_center > frame_center + 100:
                        position = "Right"
                    else:
                        position = "Center"
                    
                    current_obstacles[label] = {"distance": distance, "position": position}

        # Compare with previous frame detections
        changes = {}

        for obj, details in current_obstacles.items():
            prev_details = previous_obstacles.get(obj)
            if prev_details is None or prev_details != details:
                changes[obj] = details  # Object detected or changed

        for obj in previous_obstacles:
            if obj not in current_obstacles:
                changes[obj] = {"status": "Removed"}  # Object removed

        # If there are changes, update and return response
        if changes:
            previous_obstacles = current_obstacles.copy()
            
            return {"detected_changes": changes}

        return {}  # Return empty if no changes detected

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
`}
                      </code>
                    </pre>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Intreaction Mode FastApi Code</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-slate-400 hover:text-white"
                        onClick={() =>
                          copyToClipboard(
                            `import cv2
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
from typing import List, Dict
from io import BytesIO

app = FastAPI()

# Load YOLO Model
model = YOLO("yolov11s-face.pt")

# Constants for Distance Calculation
KNOWN_DISTANCE = 50  # cm
KNOWN_FACE_WIDTH = 14  # cm
REF_IMAGE_FACE_WIDTH = 120  # pixels
FOCAL_LENGTH = (REF_IMAGE_FACE_WIDTH * KNOWN_DISTANCE) / KNOWN_FACE_WIDTH
SCALING_FACTOR = 2.0  # Adjust based on real-world testing

# Previous state storage
previous_people = {}
THRESHOLD_DISTANCE_CHANGE = 50  # cm

# Function to Process Frame & Detect Faces
def process_frame(image: np.ndarray) -> List[Dict]:
    global previous_people
    results = model(image)
    frame_width = image.shape[1]
    current_people = {}
    detected_people = []
    
    for idx, result in enumerate(results):
        for i, box in enumerate(result.boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = box.conf[0].item()
            
            if conf > 0.5:  # Confidence threshold
                center_x = (x1 + x2) // 2
                face_width_pixels = x2 - x1
                
                # Determine Position
                if center_x < frame_width // 3:
                    position = "Left"
                elif center_x > 2 * frame_width // 3:
                    position = "Right"
                else:
                    position = "Center"
                
                # Estimate Distance
                if face_width_pixels > 0:
                    estimated_distance = (FOCAL_LENGTH * KNOWN_FACE_WIDTH) / face_width_pixels
                    estimated_distance *= SCALING_FACTOR
                else:
                    estimated_distance = -1  # Error case
                
                person_id = f"person{i+1}"
                current_people[person_id] = {
                    "distance": round(estimated_distance, 1),
                    "position": position
                }
    
    # Compare with previous state
    if previous_people:
        changes_detected = False
        for person_id, data in current_people.items():
            prev_data = previous_people.get(person_id)
            if not prev_data or abs(prev_data["distance"] - data["distance"]) > THRESHOLD_DISTANCE_CHANGE or prev_data["position"] != data["position"]:
                changes_detected = True
                break
        
        # Check if any person entered or left
        if set(current_people.keys()) != set(previous_people.keys()):
            changes_detected = True
        
        if not changes_detected:
            return []
    
    previous_people = current_people.copy()
    
    for person_id, data in current_people.items():
        detected_people.append({person_id: data})
    
    return detected_people

@app.post("/detect")
async def detect_faces(file: UploadFile = File(...)):
    image_data = await file.read()
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    faces = process_frame(image)
    return {"people": faces}
    

`,
                            "distance-code",
                          )
                        }
                      >
                        {copiedSection === "distance-code" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Copy className="mr-1 h-3 w-3" />
                        )}
                        {copiedSection === "distance-code" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto">
                      <code>
                        {`import cv2
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
from typing import List, Dict
from io import BytesIO

app = FastAPI()

# Load YOLO Model
model = YOLO("yolov11s-face.pt")

# Constants for Distance Calculation
KNOWN_DISTANCE = 50  # cm
KNOWN_FACE_WIDTH = 14  # cm
REF_IMAGE_FACE_WIDTH = 120  # pixels
FOCAL_LENGTH = (REF_IMAGE_FACE_WIDTH * KNOWN_DISTANCE) / KNOWN_FACE_WIDTH
SCALING_FACTOR = 2.0  # Adjust based on real-world testing

# Previous state storage
previous_people = {}
THRESHOLD_DISTANCE_CHANGE = 50  # cm

# Function to Process Frame & Detect Faces
def process_frame(image: np.ndarray) -> List[Dict]:
    global previous_people
    results = model(image)
    frame_width = image.shape[1]
    current_people = {}
    detected_people = []
    
    for idx, result in enumerate(results):
        for i, box in enumerate(result.boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = box.conf[0].item()
            
            if conf > 0.5:  # Confidence threshold
                center_x = (x1 + x2) // 2
                face_width_pixels = x2 - x1
                
                # Determine Position
                if center_x < frame_width // 3:
                    position = "Left"
                elif center_x > 2 * frame_width // 3:
                    position = "Right"
                else:
                    position = "Center"
                
                # Estimate Distance
                if face_width_pixels > 0:
                    estimated_distance = (FOCAL_LENGTH * KNOWN_FACE_WIDTH) / face_width_pixels
                    estimated_distance *= SCALING_FACTOR
                else:
                    estimated_distance = -1  # Error case
                
                person_id = f"person{i+1}"
                current_people[person_id] = {
                    "distance": round(estimated_distance, 1),
                    "position": position
                }
    
    # Compare with previous state
    if previous_people:
        changes_detected = False
        for person_id, data in current_people.items():
            prev_data = previous_people.get(person_id)
            if not prev_data or abs(prev_data["distance"] - data["distance"]) > THRESHOLD_DISTANCE_CHANGE or prev_data["position"] != data["position"]:
                changes_detected = True
                break
        
        # Check if any person entered or left
        if set(current_people.keys()) != set(previous_people.keys()):
            changes_detected = True
        
        if not changes_detected:
            return []
    
    previous_people = current_people.copy()
    
    for person_id, data in current_people.items():
        detected_people.append({person_id: data})
    
    return detected_people

@app.post("/detect")
async def detect_faces(file: UploadFile = File(...)):
    image_data = await file.read()
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    faces = process_frame(image)
    return {"people": faces}
    

`}
                      </code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="py-4">
          <div className="grid gap-6">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">API Reference</CardTitle>
                <CardDescription>Endpoints and integration details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 p-6 dark:from-slate-800 dark:to-slate-900">
                  <h3 className="mb-4 text-xl font-semibold">API Endpoints</h3>

                  <div className="mb-6 space-y-4">
                    <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-green-900/30 dark:bg-slate-800">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500 text-white">POST</Badge>
                          <span className="font-mono text-sm font-semibold">/detect</span>
                        </div>
                        <Badge variant="outline">Walking Mode</Badge>
                      </div>
                      <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                        Detects obstacles in the provided image frame
                      </p>
                      <div className="mb-2 rounded-md bg-slate-100 p-2 dark:bg-slate-900">
                        <p className="text-xs font-semibold">Request:</p>
                        <p className="text-xs">
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            Content-Type: multipart/form-data
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-mono text-slate-600 dark:text-slate-400">file: [image binary]</span>
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-900">
                        <p className="text-xs font-semibold">Response:</p>
                        <pre className="overflow-x-auto text-xs">
                          <code className="text-slate-600 dark:text-slate-400">
                            {`{
  "detected_changes": {
    "object1": {
      "distance": "Near",
      "position": "Left",
      "status": "New"
    },
    "object2": {
      "distance": "Medium",
      "position": "Center"
    }
  }
}`}
                          </code>
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-blue-900/30 dark:bg-slate-800">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500 text-white">POST</Badge>
                          <span className="font-mono text-sm font-semibold">/detect</span>
                        </div>
                        <Badge variant="outline">Interaction Mode</Badge>
                      </div>
                      <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                        Detects people and their positions in the provided image frame
                      </p>
                      <div className="mb-2 rounded-md bg-slate-100 p-2 dark:bg-slate-900">
                        <p className="text-xs font-semibold">Request:</p>
                        <p className="text-xs">
                          <span className="font-mono text-slate-600 dark:text-slate-400">
                            Content-Type: multipart/form-data
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-mono text-slate-600 dark:text-slate-400">file: [image binary]</span>
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-900">
                        <p className="text-xs font-semibold">Response:</p>
                        <pre className="overflow-x-auto text-xs">
                          <code className="text-slate-600 dark:text-slate-400">
                            {`{
  "people": {
    "person1": {
      "distance_cm": 120,
      "position": "Left"
    },
    "person2": {
      "distance_cm": 85,
      "position": "Center"
    }
  }
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-4 text-xl font-semibold">Integration Example</h3>
                  <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">API Integration with Next.js</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-slate-400 hover:text-white"
                        onClick={() =>
                          copyToClipboard(
                            `// Example API integration in Next.js
const processFrame = async (imageBlob: Blob) => {
  try {
    // Create form data for API request
    const formData = new FormData();
    formData.append("file", imageBlob, "frame.jpg");

    const response = await fetch("https://api.blindassist.ai/detect", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      
      // Process the detection results
      if (data && data.detected_changes) {
        // Handle obstacle detections
        console.log("Detected obstacles:", data.detected_changes);
      } else if (data && data.people) {
        // Handle people detections
        console.log("Detected people:", data.people);
      }
    }
  } catch (error) {
    console.error("Error sending frame to API:", error);
  }
};`,
                            "api-integration",
                          )
                        }
                      >
                        {copiedSection === "api-integration" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Copy className="mr-1 h-3 w-3" />
                        )}
                        {copiedSection === "api-integration" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto">
                      <code>
                        {`// Example API integration in Next.js
const processFrame = async (imageBlob: Blob) => {
  try {
    // Create form data for API request
    const formData = new FormData();
    formData.append("file", imageBlob, "frame.jpg");

    const response = await fetch("https://api.blindassist.ai/detect", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      
      // Process the detection results
      if (data && data.detected_changes) {
        // Handle obstacle detections
        console.log("Detected obstacles:", data.detected_changes);
      } else if (data && data.people) {
        // Handle people detections
        console.log("Detected people:", data.people);
      }
    }
  } catch (error) {
    console.error("Error sending frame to API:", error);
  }
};`}
                      </code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="py-4">
          <div className="grid gap-6">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Deployment Guide</CardTitle>
                <CardDescription>How to deploy and run the application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-6">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <h3 className="mb-4 text-xl font-semibold text-blue-700 dark:text-blue-300">
                      Frontend Deployment (Vercel)
                    </h3>
                    <ol className="ml-6 list-decimal space-y-4">
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Clone the repository:</span>
                        <div className="mt-2 rounded-md bg-slate-800 p-2 text-xs text-white">
                          <code>git clone https://github.com/username/blind-assist-ai.git</code>
                        </div>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Install dependencies:</span>
                        <div className="mt-2 rounded-md bg-slate-800 p-2 text-xs text-white">
                          <code>cd blind-assist-ai && npm install</code>
                        </div>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Deploy to Vercel:</span>
                        <div className="mt-2 rounded-md bg-slate-800 p-2 text-xs text-white">
                          <code>vercel</code>
                        </div>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Set environment variables:</span>
                        <p className="mt-1">
                          Configure the following environment variables in your Vercel project settings:
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                          <li>
                            <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-700">
                              NEXT_PUBLIC_API_URL
                            </code>
                            : Your backend API URL
                          </li>
                          <li>
                            <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-700">
                              NEXT_PUBLIC_GEMINI_API_KEY
                            </code>
                            : Your Gemini API key
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 p-6 dark:from-purple-900/30 dark:to-violet-900/30">
                    <h3 className="mb-4 text-xl font-semibold text-purple-700 dark:text-purple-300">
                      Backend Deployment (Hugging Face)
                    </h3>
                    <ol className="ml-6 list-decimal space-y-4">
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Create a Hugging Face Space:</span>
                        <p className="mt-1">
                          Go to{" "}
                          <a
                            href="https://huggingface.co/spaces"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            huggingface.co/spaces
                          </a>{" "}
                          and create a new Space.
                        </p>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Configure the Space:</span>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          <li>Select FastAPI as the SDK</li>
                          <li>Choose a GPU if needed for better performance</li>
                        </ul>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Upload your code:</span>
                        <p className="mt-1">
                          Upload your FastAPI application code and model files to the Space repository.
                        </p>
                      </li>
                      <li className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Create requirements.txt:</span>
                        <div className="mt-2 rounded-md bg-slate-800 p-2 text-xs text-white">
                          <code>
                            {`fastapi==0.95.0
uvicorn==0.21.1
torch==2.0.0
ultralytics==8.0.0
opencv-python-headless==4.7.0.72
python-multipart==0.0.6
numpy==1.24.2`}
                          </code>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-900/30 dark:to-emerald-900/30">
                    <h3 className="mb-4 text-xl font-semibold text-green-700 dark:text-green-300">Docker Deployment</h3>
                    <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        For containerized deployment, you can use Docker to package both the frontend and backend
                        applications.
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-800 p-3 text-xs text-white">
                      <p className="mb-2 font-semibold text-green-400">Dockerfile for Backend:</p>
                      <pre className="overflow-x-auto">
                        <code>
                          {`FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`}
                        </code>
                      </pre>
                    </div>
                    <div className="mt-4 rounded-md bg-slate-800 p-3 text-xs text-white">
                      <p className="mb-2 font-semibold text-green-400">Docker Compose:</p>
                      <pre className="overflow-x-auto">
                        <code>
                          {`version: '3'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - MODEL_PATH=/app/models/yolov8n.pt

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 p-6 dark:from-slate-800 dark:to-slate-900">
                  <h3 className="mb-4 text-xl font-semibold">System Requirements</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <h4 className="mb-2 font-semibold">Frontend</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Node.js 18.x or higher</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>npm 8.x or higher</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Modern web browser with camera access</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                      <h4 className="mb-2 font-semibold">Backend</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Python 3.10 or higher</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>CUDA-compatible GPU (recommended)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>4GB+ RAM</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
