# ⌨️ CHAOS TYPER

> **"The code flows where the mind goes. Debug the universe."**
<img width="1915" height="866" alt="image" src="https://github.com/user-attachments/assets/da55e287-b57a-4292-90ba-ddd818bbe93d" />

**Chaos Typer** is a high-octane, cyberpunk-themed typing speed game built with **Next.js**, **Tailwind CSS**, and **GSAP**. It features an immersive narrative interface, reactive visual effects (screen shake, glitches), and a dynamic AI avatar that judges your typing speed in real-time.

---

## ⚡ Features

* **Cinematic Onboarding**: A three-stage flow (Landing -> Identity Verification -> Mission Briefing).
* **Reactive Gameplay**:
    * **Visual Feedback**: Screen shake and RGB text splitting based on typing intensity.
    * **Dynamic Avatar**: An AI operator that reacts to your performance (Bored vs. Angry).
    * **Overdrive Mode**: Hit >45 WPM to trigger maximum visual intensity.
* **Real-time Metrics**: Optimized, lag-free tracking of **WPM** and **Accuracy**.
* **Audio Integration**: Low-latency mechanical keyboard sounds.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animation**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
    * Plugins: `TextPlugin`, `useGSAP`.
* **State Management**: React Hooks (`useRef` for performance optimization).

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/abk700007/chaos-typer.git
cd chaos-typer
```
### 2. Install Dependencies
Bash
```
npm install
npm install gsap @gsap/react
```
### 3. Asset Configuration (CRITICAL) ⚠️
For the game to work correctly on deployed servers (like Vercel), you must place the following files in your public/ folder. Note: Filenames must be lowercase to avoid deployment errors.

public/click.mp3 (Short mechanical click sound)

public/avatar-bored.png (Image for idle/slow state)

public/avatar-angry.png (Image for fast/overdrive state)

### 4. Run Development Server
```
npm run dev
```
Open http://localhost:3000 to initialize the link.
