# 🌌 Celestial Sky Explorer

An immersive, realistic 3D night sky planetarium built with React, Three.js, and WebGL. Experience the cosmos like never before with AR support, real-time rendering, and stunning visual effects.

![Night Sky App](https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200)

## ✨ Features

### 🌟 Realistic 3D Star Rendering
- **4,000+ Stars** with accurate positions, magnitudes, and colors
- **Custom WebGL Shaders** for realistic twinkling and glow effects
- **Diffraction Spikes** on bright stars for authentic telescope-like appearance
- **Magnitude-based Sizing** - brighter stars appear larger
- **Color Temperature Mapping** - stars display accurate spectral colors (blue giants to red dwarfs)

### 🌌 Milky Way Galaxy
- **Volumetric Rendering** using procedural noise shaders
- **Realistic Dust Lanes** and star cloud structures
- **Animated Shimmer** effects for living galaxy appearance
- **Proper Galactic Positioning** across the celestial sphere

### 🪐 Solar System Objects
- **All 8 Planets** - Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune
- **The Moon** with realistic glow and positioning
- **3D Sphere Rendering** with atmospheric glow effects
- **Real-time Position Calculations** based on astronomical algorithms

### 🔭 Deep Sky Objects (40+)
- **Galaxies**: Andromeda (M31), Triangulum (M33), Whirlpool (M51), Sombrero (M104), and more
- **Nebulae**: Orion Nebula (M42), Crab Nebula (M1), Ring Nebula (M57), Eagle Nebula (M16)
- **Star Clusters**: Pleiades (M45), Beehive Cluster (M44), Hercules Cluster (M13)
- **Animated Volumetric Effects** for nebulae with procedural noise

### ⭐ Constellations
- **30+ Major Constellations** with named stars
- **130+ Named Stars** including:
  - Orion (Betelgeuse, Rigel, Bellatrix)
  - Ursa Major (Dubhe, Merak, Alioth)
  - Scorpius (Antares, Shaula)
  - Lyra (Vega)
  - Cygnus (Deneb)
  - And many more...

### 🌈 Northern Lights (Aurora Borealis)
- **Toggle-able Aurora Effect** with realistic curtain animations
- **Multi-layered Rendering** for depth and movement
- **Procedural Color Gradients** (green, blue, purple, pink)
- **Wave-based Animation** mimicking real aurora behavior

### 📱 AR Camera Mode
- **Real-time Camera Background** using device camera
- **Device Orientation Support** - move your phone to explore the sky
- **Overlay Mode** - see celestial objects over your real environment
- **Permission Handling** for camera and orientation sensors

### 🔍 Search Functionality
- **Search All Objects**: Stars, Planets, Constellations, Galaxies, Nebulae
- **Real-time Filtering** as you type
- **Object Selection** with camera navigation to selected object
- **Categorized Results** for easy browsing

### 🎮 Navigation Controls
- **Virtual Joystick** for smooth 360° navigation
- **Touch/Mouse Drag** to pan across the sky
- **Pinch-to-Zoom** for mobile devices
- **Orbit Controls** for desktop exploration

### 🎨 Visual Effects
- **Atmospheric Sky Gradient** from horizon to zenith
- **Glow Effects** on all celestial objects
- **Smooth Animations** at 60fps
- **Dark Mode Optimized** for night viewing

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Three.js** | 3D Graphics Engine |
| **@react-three/fiber** | React Three.js Renderer |
| **@react-three/drei** | Three.js Helpers |
| **WebGL Shaders** | Custom Star/Nebula Rendering |
| **Tailwind CSS** | Styling |
| **Vite** | Build Tool |
| **Lucide React** | Icons |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ThreeSkyScene.tsx      # Main 3D scene with all celestial objects
│   ├── NorthernLights.tsx     # Aurora Borealis effect
│   ├── ARCameraBackground.tsx # Camera feed for AR mode
│   ├── SearchBox.tsx          # Object search functionality
│   ├── JoystickController.tsx # Virtual joystick navigation
│   ├── SkyCanvas.tsx          # Legacy 2D canvas (deprecated)
│   ├── CompassOverlay.tsx     # Directional compass
│   ├── ControlPanel.tsx       # Settings panel
│   ├── ObjectInfo.tsx         # Selected object details
│   └── LoadingScreen.tsx      # Initial loading animation
├── data/
│   └── starCatalog.ts         # Star, constellation, DSO databases
├── lib/
│   └── astronomy.ts           # Astronomical calculations
├── pages/
│   └── Index.tsx              # Main app page
└── index.css                  # Global styles & design tokens
```

---

## 🎯 Key Components

### ThreeSkyScene.tsx
The heart of the application - renders:
- Background star field (15,000 stars)
- Catalog stars with custom shaders
- Milky Way volumetric band
- Planets and Moon with glow
- Deep sky objects (nebulae, galaxies)
- Northern Lights when enabled

### Custom WebGL Shaders
- **Star Vertex/Fragment Shaders**: Twinkling, color, size, glow
- **Milky Way Shaders**: Procedural noise, dust lanes
- **DSO Shaders**: Volumetric nebula effects
- **Aurora Shaders**: Animated curtain effects

### starCatalog.ts
Comprehensive astronomical database:
- 130+ named stars with RA/Dec coordinates
- 30+ constellation definitions
- 40+ deep sky objects
- 4,000 background stars

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Usage Guide

### Basic Navigation
1. **Drag** to pan across the sky
2. **Pinch/Scroll** to zoom in/out
3. Use the **joystick** for smooth movement

### AR Mode
1. Tap the **camera icon** to enable AR
2. Grant camera permissions when prompted
3. Point your device at the sky
4. See celestial objects overlaid on reality

### Northern Lights
1. Tap the **aurora toggle** button
2. Watch the beautiful aurora animation
3. Best viewed looking toward the horizon

### Search Objects
1. Tap the **search icon**
2. Type a star, planet, or constellation name
3. Select from results to navigate

---

## 🌟 Featured Objects

### Brightest Stars
| Star | Constellation | Magnitude |
|------|---------------|-----------|
| Sirius | Canis Major | -1.46 |
| Canopus | Carina | -0.72 |
| Arcturus | Boötes | -0.05 |
| Vega | Lyra | 0.03 |
| Capella | Auriga | 0.08 |

### Notable Deep Sky Objects
| Object | Type | Description |
|--------|------|-------------|
| M31 | Galaxy | Andromeda Galaxy - nearest major galaxy |
| M42 | Nebula | Orion Nebula - stellar nursery |
| M45 | Cluster | Pleiades - Seven Sisters |
| M51 | Galaxy | Whirlpool Galaxy |
| M1 | Nebula | Crab Nebula - supernova remnant |

---

## 🎨 Design System

The app uses a cosmic-themed design system with:
- **Primary**: Deep space purple (#6366f1)
- **Background**: Near-black (#0a0a0f)
- **Accents**: Nebula pink, stellar blue
- **Glass Morphism**: Frosted glass UI elements

---

## 🔮 Future Enhancements

- [ ] Shooting stars and meteor showers
- [ ] Constellation line drawings
- [ ] Time-lapse mode with star trails
- [ ] Audio ambiance (night sounds)
- [ ] ISS tracking
- [ ] Eclipse simulations
- [ ] VR headset support
- [ ] Offline mode with cached data

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Acknowledgments

- Star position data from astronomical catalogs
- Three.js community for amazing 3D tools
- React Three Fiber for seamless integration

---

**Built with ❤️ and stardust**
