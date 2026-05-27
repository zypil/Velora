<div align="center">

<!-- Animated Logo -->
<img src="https://raw.githubusercontent.com/zypil/Velora/main/icon.png" width="120" height="120" alt="Velora Logo">

<!-- Title with Gradient -->
<h1>
  <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=42&duration=3000&pause=1000&color=00F5D4&center=true&vCenter=true&width=300&lines=VELORA" alt="Velora" />
</h1>

<!-- Tagline -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=16&duration=4000&pause=1000&color=FFFFFF&center=true&vCenter=true&width=500&lines=Velocity+%26+Motion+Tracker;Real-time+Speedometer;GPS-Powered+Jogging+Tracker;Measure+Speed.+Track+Distance.+Feel+the+Rush." alt="Tagline" />
</p>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/GPS-00F5D4?style=for-the-badge&logo=google-maps&logoColor=white" alt="GPS">
  <img src="https://img.shields.io/badge/No%20Backend-FF2D7B?style=for-the-badge&logo=serverless&logoColor=white" alt="No Backend">
</p>

<!-- License Badge -->
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-00F5D4?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="MIT License">
  <img src="https://img.shields.io/badge/Version-1.0.0-72009F?style=for-the-badge&logo=semver&logoColor=white" alt="Version">
  <img src="https://img.shields.io/badge/Status-Stable-00FF9D?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Status">
</p>

<br>

<!-- Preview Image -->
<img src="https://raw.githubusercontent.com/zypil/Velora/main/preview.jpeg" width="100%" alt="Velora Preview" style="border-radius: 20px; box-shadow: 0 20px 60px rgba(0,245,212,0.15);">

</div>

---

## ✨ Features

<div align="center">

| 🚗 **Vehicle Mode** | 🏃 **Jogging Mode** |
|:---:|:---:|
| Real-time Speedometer | GPS Distance Tracking |
| Max Speed Record | Pace per Kilometer |
| Total Distance | Calorie Burn Counter |
| Trip Duration | Live Pace Graph |
| Average Speed | Progress Ring Animation |

</div>

---

## 🎨 Design Philosophy

> *"Every pixel matters. Every animation tells a story."*

Velora is built with a **dark glassmorphism aesthetic** featuring:

- 🌌 **Ambient Orb Backgrounds** — Floating gradient orbs with blur effects
- 🔮 **Glassmorphism UI** — Frosted glass cards with subtle borders
- ✨ **Cinematic Intro** — Animated logo reveal with particle effects
- 🎯 **Smooth Transitions** — Custom cubic-bezier easing throughout
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🎭 **Zero External Dependencies** — Pure HTML, CSS, and JavaScript

---

## 🚀 Quick Start

### Option 1: Direct Open
```bash
# Clone the repository
git clone https://github.com/yourusername/velora.git

# Navigate to project
cd velora

# Open in browser (or simply double-click index.html)
open index.html
```

### Option 2: Live Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```
velora/
├── 📄 index.html          # Main application markup
├── 🎨 style.css           # Premium glassmorphism styles
├── ⚡ app.js              # GPS tracking engine
├── 📜 LICENSE             # MIT License
└── 📖 README.md           # This file
```

> **Note:** No build tools, no package managers, no bundlers. Just pure web technologies.

---

## 🛠️ How It Works

### GPS Permission Flow

```
┌─────────────────┐
│  Open Velora    │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Click Start    │
└────────┬────────┘
         ▼
┌─────────────────────────┐
│  Browser asks:          │
│  "Allow location?"      │
└────────┬────────────────┘
         ▼
    ┌────────┐    ┌────────┐
    │ Allow  │    │ Block  │
    └───┬────┘    └───┬────┘
        ▼             ▼
   ┌─────────┐   ┌──────────┐
   │ GPS ON  │   │ GPS OFF  │
   │ Realtime│   │ Speed = 0│
   │ Data    │   │ Wait...  │
   └─────────┘   └──────────┘
```

### Technical Details

| Feature | Implementation |
|---------|---------------|
| **Geolocation** | Navigator Geolocation API (`watchPosition`) |
| **Distance** | Haversine formula for accurate Earth-surface calculation |
| **Speed** | `position.coords.speed` × 3.6 (m/s → km/h) |
| **Pace** | Time ÷ Distance (min/km) |
| **Calories** | Distance × 60 kcal/km (average runner) |
| **Charts** | HTML5 Canvas with custom rendering |

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Edge | ✅ Full Support |
| Safari (iOS) | ✅ Full Support |
| Firefox | ✅ Full Support |
| Samsung Internet | ✅ Full Support |

> **iOS Users:** Safari requires HTTPS for GPS access. Deploy to GitHub Pages or use a local HTTPS server.

---

## 🎨 Color Palette

<div align="center">

| Color | Hex | Usage |
|:---:|:---|:---|
| Cyan | `#00F5D4` | Primary accent, vehicle mode |
| Purple | `#72009F` | Secondary accent |
| Pink | `#F15BB5` | Tertiary accent, jogging mode |
| Yellow | `#FEE440` | Highlights, warm tones |
| Blue | `#00BBF9` | Info, cool tones |
| Background | `#0A0A0F` | Deep space black |

</div>

---

## 🎯 Roadmap

- [x] Real-time GPS speedometer
- [x] Jogging distance & pace tracker
- [x] Live pace graph (Canvas)
- [x] Cinematic intro animation
- [x] Glassmorphism UI design
- [ ] Export trip data (GPX/JSON)
- [ ] Dark/Light theme toggle
- [ ] Offline mode with localStorage
- [ ] Voice announcements
- [ ] Apple Watch / Wear OS support

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔁 Open a Pull Request

---

## 📄 License

```
MIT License

Copyright (c) 2026 Velora Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<div align="center">

---

**Made with 💜 and pure web technologies.**

<p align="center">
  <img src="https://raw.githubusercontent.com/yourusername/velora/main/assets/logo.svg" width="40" height="40" alt="Velora">
</p>

*Measure Speed. Track Distance. Feel the Rush.*

</div>
