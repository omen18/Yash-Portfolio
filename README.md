# 🚀 Yash Raj Sharan | Personal Portfolio & Lab

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r168-black?logo=threedotjs&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green?logo=greensock&logoColor=white)](https://gsap.com)
[![Physics](https://img.shields.io/badge/Rapier_Physics-3D-purple)](https://rapier.rs)
[![License](https://img.shields.io/badge/License-PPL_1.0-orange.svg)](LICENSE)

An immersive, high-performance 3D portfolio and interactive AI engineering lab built with **React**, **Three.js (React Three Fiber + Rapier Physics)**, and **GSAP**. It showcases a fusion of modern web aesthetics, interactive simulation, full-stack software architecture, native iOS & macOS apps, and Machine Learning engineering.

---

<p align="center">
  <img width="1667" height="943" alt="Portfolio Preview" src="https://github.com/user-attachments/assets/b6a9022d-ff24-41e6-ae3f-c97c8c7eafb5" />
</p>

---

## ✨ Immersive Interactive Features

This portfolio is an interactive engineering playground showcasing deep technical capabilities:

*   **🎮 3D Rigid-Body Physics Skill Wall (`TechStack.tsx`)**: An interactive 3D physics simulation using `@react-three/rapier` and `N8AO` post-processing. Technologies fall as interactive spherical capsules that collide, roll, and respond to gravity.
*   **📊 Live GitHub Contribution Grid (`GithubHeatmap.tsx`)**: Custom-rendered dark matrix tracking **3,000+ contributions**, **23 public repositories**, and a **134-day longest streak** with GSAP scroll and cell reveal animations.
*   **💻 Interactive CLI Terminal (`AskYash.tsx`)**: A simulated command-line interface mimicking a booting systems kernel (`yash.exe`). Allows users to query specific topics (`current_focus`, `why_ai`, `featured_build`) via interactive command strings.
*   **👤 Custom Decrypted 3D Avatar Engine (`Character/Scene.tsx`)**: Renders a 3D model with custom real-time mouse tracking (the model's head follows the cursor), dynamic lighting, and custom decryption/loading optimizations.
*   **🧪 The Research Lab (`ResearchLab.tsx`)**: Interactive experiment cards with cursor-responsive hover glow tracking and custom modal popups showcasing classical Computer Vision and Machine Learning experiments.
*   **✨ Slick Motion Architecture**: High-fidelity scroll animations powered by GSAP, split-text letters reveals, and custom cursor trackers.

---

## 🛠️ Tech Stack & Lab Architecture

### **Core Frontend & Graphics**
*   **Framework**: React 18 & TypeScript (compiled with Vite)
*   **3D Render Engine**: Three.js via `@react-three/fiber` & `@react-three/drei`
*   **Physics Engine**: `@react-three/rapier` (high-performance rigid-body physics)
*   **Post-processing**: `@react-three/postprocessing` (Ambient Occlusion via `N8AO`)
*   **Animations**: GreenSock (GSAP) & `@gsap/react` for scroll triggers and timelines

### **Mobile & Native Systems**
*   Swift 5.9, SwiftUI, Xcode, iOS SDK, ScreenCaptureKit, VideoToolbox, Network.framework, CoreGraphics, Flutter, Dart, Material 3

### **AI & Machine Learning Focus**
*   PyTorch, TensorFlow, OpenCV, LangChain, OpenAI API, HuggingFace, YOLOv8, ResUNet, EfficientNet-B0, RAG Pipelines, Fine-Tuning

### **Backend & Cloud Infrastructure**
*   Node.js, Express, FastAPI, Next.js, PostgreSQL, MongoDB, MySQL, DuckDB, WebAssembly, Prisma, Docker, AWS

---

## 📂 Featured Projects Showcase

The portfolio features 9 active engineering builds + 1 upcoming Machine Learning project:

1.  **Ticket Booking System (Showpass)** 🎫  
    *Full-Stack Booking Platform & Database Architecture*  
    *Tech*: React, TypeScript, Node.js, Express, MySQL  
    *Links*: [GitHub Repo](https://github.com/omen18/Ticket-Booking-System) | [Live Demo](https://show-pass-lemon.vercel.app/)

2.  **IslandPet** 🏝️  
    *Gamified Focus Companion iOS App*  
    *Tech*: Swift, SwiftUI, iOS SDK, Dynamic Island Integration  
    *Links*: [GitHub Repo](https://github.com/omen18/IslandPet)

3.  **AI Study Companion** 📚  
    *LLM Personalized Learning Platform*  
    *Tech*: React, FastAPI, OpenAI API, LLM Agents  
    *Links*: [GitHub Repo](https://github.com/omen18/ai-study-companion)

4.  **AmritKrishi 2.0** 🌾  
    *Agri-tech Platform for Crop Insights & Analytics*  
    *Tech*: React, Node.js, Express, PostgreSQL, Crop Analytics  
    *Links*: [GitHub Repo](https://github.com/omen18/amritkrishi2.0/tree/master)

5.  **AI Delivery Route Planner** 🚚  
    *Interactive 3D Graph Optimization & Pathfinding*  
    *Tech*: React, Three.js, Graph Theory, A* / Dijkstra Search  
    *Links*: [GitHub Repo](https://github.com/omen18/AI-delivery-route-planner) | [Live Demo](https://ai-delivery-route-planner.vercel.app/)

6.  **CutisAI** 🔬  
    *Clinical AI Dermatology & Skin Lesion Screening Engine*  
    *Tech*: ResUNet, EfficientNet-B0, React, ONNX, ISIC Dataset, Clinical AI  
    *Links*: [GitHub Repo](https://github.com/omen18/CutisAI.git)

7.  **CodeStride** 🏃  
    *Open-Source Developer Productivity & Goal Tracking Dashboard*  
    *Tech*: React, Next.js, GitHub OAuth API, Contribution Heatmaps, PR Velocity  
    *Links*: [GitHub Repo](https://github.com/omen18/CodeStride.git)

8.  **MacDeck** 🖥️  
    *iOS and macOS App — Low-Latency Remote Desktop & Element-Snapping Controller*  
    *Tech*: Swift 5.9, SwiftUI, ScreenCaptureKit, VideoToolbox, Network.framework, CoreGraphics  
    *Links*: [GitHub Repo](https://github.com/omen18/MacDeck)

9.  **Musify** 🎵  
    *Flutter Music Streaming & Offline Audio Player with Lyrics & SponsorBlock*  
    *Tech*: Flutter, Dart, Material 3, YouTube API, Offline Audio Cache, SponsorBlock  
    *Links*: [GitHub Repo](https://github.com/omen18/Musify.git)

10. **Coming Soon (#10)** 🤖  
    *Machine Learning & Intelligent Autonomous Systems Engine*

---

## 🚀 Local Installation & Setup

Want to run the laboratory locally on your machine? Follow these commands:

### **1. Clone the repository**
```bash
git clone https://github.com/omen18/Yash-Portfolio.git
cd Yash-Portfolio
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Run the development server**
```bash
npm run dev
```

---

## ⚠️ Important License & Usage Notices

### **GSAP Trial License Warning**
This project uses trial versions of **GSAP Club plugins** (`gsap-trial`). 
*   These plugins are only intended for local learning and evaluation.
*   They **cannot** be deployed to production or used for public hosting. 
*   For official production deployment, check out [GSAP Installation Docs](https://gsap.com/docs/v3/Installation/).

### **Design & Content Reuse**
> [!IMPORTANT]  
> This project is shared strictly for learning and inspiration.
> Please **do NOT**:
> *   Clone or replicate the full website structure/design.
> *   Repost it with minor text/content changes.
> *   Use it for commercial or client projects.
> *   Publish tutorials using this exact source code.

---

## 📄 License

This project is licensed under the **Personal Portfolio License (PPL) v1.0**. See the [LICENSE](LICENSE) file for details.

Developed with 💻 and ☕ by [Yash Raj Sharan](https://github.com/omen18).
