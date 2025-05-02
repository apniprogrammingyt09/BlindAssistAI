# 🧠 Blind Assist AI — Smart Navigation for the Visually Impaired

> A Real-Time, AI-powered Assistant that Empowers Independent Living Without Special Hardware.


## 📸 Overview

**Blind Assist AI** is an intelligent assistive system designed to support visually impaired individuals in navigating their environment safely and independently. Unlike traditional text-to-speech apps, Blind Assist AI uses advanced AI techniques to detect, understand, and describe surroundings contextually.


## 🌟 Key Features

- 🔍 **Real-Time Object Detection** (YOLOv8):
  Detects obstacles and objects using the live video feed from a mobile or webcam.

- 📏 **Distance & Direction Estimation**:
  Calculates how far each object is and classifies whether it’s to the left, center, or right.

- 🎤 **Voice Interaction with Gemini API**:
  Users can ask questions or issue commands through voice; the AI responds contextually.

- 🧠 **Dual Modes**:
  - **Walking Mode** – Alerts about obstacles while walking.
  - **Interaction Mode** – Detects and identifies known faces for social interaction.

- 🔊 **Text-to-Speech Output**:
  The system communicates findings back to the user using real-time audio.

- 🌐 **Cloud Scalable**:
  Deployable across web, mobile, and edge platforms using FastAPI & Hugging Face.

## ⚙️ Tech Stack

| Component        | Technology Used                  |
|------------------|----------------------------------|
| Object Detection | YOLOv8, OpenCV                   |
| Voice Assistant  | Gemini API (Google)             |
| API Backend      | FastAPI                          |
| Contextual AI    | Hugging Face Transformers        |
| Audio Feedback   | gTTS / pyttsx3 / Web Speech API  |
| Deployment       | IDX, Docker, Cloudflare, Hugging Face Spaces |

---

## 🔁 Workflow (Simple 3-Step)

1. **Capture Input** – Live feed & voice command input via camera and microphone.
2. **Process** – AI detects, identifies, estimates position/distance and listens to commands.
3. **Output** – Spoken real-time feedback is given for guidance.



## 🧠 Use Case Diagram Summary

- **Actors**: Mobile Camera, Microphone, Visually Impaired User  
- **Processes**:  
  - Capture live feed  
  - Detect objects  
  - Estimate distance  
  - Classify object position  
  - Provide TTS feedback  
  - Switch modes (Walking/Interaction)  
  - Recognize faces (Interaction Mode)  
  - Interact via voice using Gemini



## 🌍 Impact

- 🛡️ Increases mobility safety for visually impaired individuals  
- 🗣️ Fosters social inclusion through voice-enabled interaction  
- 🧩 Closes accessibility gaps with AI  
- 💸 Requires no expensive or proprietary hardware



## 🚀 Future Scope

- 📲 Mobile application for on-the-go translation and assistance  
- 🗣️ Multilingual voice support (Hindi, Marathi, Tamil, etc.)  
- 🧑‍🤝‍🧑 Integration with real-time virtual assistants like Google Assistant  
- 🛑 Obstacle-level critical alerts and warnings  
- 🕶️ Compatibility with smart glasses and wearables  
- 🧠 On-device edge AI for offline support


## 📂 Project Phases

| Phase        | Description                             |
|--------------|-----------------------------------------|
| **Phase 1**  | AI Model Training (YOLOv8, Gemini)      |
| **Phase 2**  | Backend Development using FastAPI       |
| **Phase 3**  | Frontend Integration & Deployment       |


## 👨‍💻 Developer Info

> Built with ❤️ by [Krish Bhagat](https://www.linkedin.com/in/krish-bhagat-47512a289/)

- 👨‍🎓 Third Year CSE Student (Data Science Specialization)  
- 🔬 Focus Areas: AI/ML, Computer Vision, Voice Assistants  
- 🛠️ GitHub: [apniprogrammingyt09](https://github.com/apniprogrammingyt09)  
- 🌐 Portfolio: [krishbhagat.me](https://kodrish.me)  



## 🏢 Powered By: KodRish Innovation & Solution LLP

> KodRish is a tech startup dedicated to providing impactful solutions using AI, web, and mobile technologies.

- 🌍 Website: [https://kodrish.me](https://kodrish.me)  
- 📸 Services: Web Dev, AI Projects, Design Solutions  
- 🔗 Instagram: [@kodrish](https://instagram.com/kodrish)



## 📜 License

This project is open-sourced under the [MIT License](LICENSE). You are free to use, modify, and distribute with proper credit.


## 🤝 Contributing

Contributions are welcome and encouraged!  
Please create an issue to discuss new ideas or bug fixes before raising a pull request.


## 🧠 Summary

Blind Assist AI is not just a tool — it's a companion for the visually impaired. Designed with empathy, powered by AI, and built for real-world accessibility.

> Empowering Lives. One Step at a Time. 🦯
