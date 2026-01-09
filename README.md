# Musical Fountain Project

A 3D musical fountain simulation that responds to music in real-time. The fountain's water particles, lights, and effects dynamically change based on audio input, creating a mesmerizing visual experience.

## Features

### Visual Effects 🌟
- **Bloom Effect**: Post-processing bloom with adjustable intensity for glowing water particles
- **Environment Mapping**: Realistic reflections using cube map textures
- **Dynamic Lighting**: Synchronized with music beats and frequencies

### Fountain Patterns 💧
- **Spray**: Default spray pattern with wide dispersion
- **Cascade**: Waterfall-like flow spreading horizontally
- **Jet**: Powerful vertical jet shooting high
- **Circular**: Radial spray pattern creating a dome effect
- **Auto-Switch**: Automatically changes patterns on beat detection

### Interactive Controls 🎛️
- **Real-time Control Panel**: Modern glass-morphism UI on the right side
- **Water Color Picker**: 6 preset colors (White, Blue, Cyan, Purple, Yellow, Orange)
- **Physics Adjustments**:
  - Particle count: 5,000 - 50,000
  - Gravity: 0.1 - 0.5
- **Bloom Settings**:
  - Toggle on/off
  - Intensity slider (0.5 - 3.0)

### Camera System 🎥
- **6 Camera Presets**: Default, Front View, Top View, Side View, Close-up, Dramatic
- **Cinematic Transitions**: Smooth 1.5-second animated camera movements
- **Orbit Controls**: Full manual camera control (rotate, zoom, pan)

### Audio System 🎵
- Real-time audio analysis and visualization
- Multiple pre-loaded music tracks (8 songs)
- Custom audio file upload support
- Frequency-based particle synchronization
- Beat detection for pattern switching
- Play/Pause controls

## Technologies Used

- **React 18.3.1** - UI framework
- **Three.js 0.166.1** - 3D graphics library
- **React Three Fiber 8.16.8** - React renderer for Three.js
- **@react-three/drei 9.109.2** - Helper utilities for React Three Fiber
- **@react-three/postprocessing 2.16.2** - Post-processing effects (Bloom)
- **Web Audio API** - Audio analysis and processing
- **Custom GLSL Shaders** - Water particle rendering

## Project Structure

```
musical-fountain/
├── public/
│   ├── images/
│   │   ├── envmap/          # Environment cube map textures
│   │   └── water_drop_texture.png
│   └── musics/              # Pre-loaded music tracks
├── src/
│   ├── components/
│   │   ├── AudioAnalyzer.js    # Audio processing and UI controls
│   │   ├── ControlPanel.js     # Interactive control panel for effects
│   │   ├── Fountain.js         # Main fountain component
│   │   ├── WaterParticles.js   # Particle system for water
│   │   ├── LightSystem.js      # Dynamic lighting
│   │   └── FountainBase.js     # Fountain base geometry
│   ├── shaders.js              # GLSL shader code
│   ├── App.js                  # Main application component
│   ├── AudioAnalyzer.module.css  # Styling for audio controls
│   └── ControlPanel.module.css   # Styling for control panel
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd musical-fountain
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will run on port 3007 (http://localhost:3007)

## Usage

### Getting Started

1. **Select Music**: Choose from 8 pre-loaded tracks or upload your own audio file
2. **Play/Pause**: Click Play button to start the music and fountain animation

### Camera Control

3. **Manual Control**: Use mouse to rotate, zoom, and pan around the 3D scene
4. **Camera Presets**: Select from 6 preset angles in the control panel:
   - Default: Standard view
   - Front View: Front-facing perspective
   - Top View: Overhead angle
   - Side View: Side profile
   - Close-up: Detailed close-range view
   - Dramatic: Cinematic angled shot

### Visual Effects

5. **Bloom Effect**: Toggle bloom and adjust intensity for glowing effects
6. **Fountain Pattern**: Choose from 4 patterns or enable auto-switch
7. **Water Color**: Select from 6 preset colors
8. **Physics Control**: Adjust particle count and gravity in real-time

### Tips

- Enable **Auto-switch pattern** for dynamic pattern changes on beat
- Higher particle counts provide more detail but may affect performance
- Lower gravity creates slower, more floaty water movement
- Use **Dramatic** camera preset for cinematic shots

## How It Works

### Audio Analysis
The `AudioAnalyzer` component:
- Creates an Web Audio API context and analyser node
- Extracts frequency data using FFT (Fast Fourier Transform)
- Calculates average values for bass (0-200Hz), mid (200-2000Hz), and treble (2000-20000Hz) frequencies
- Detects beats based on bass intensity
- Sends audio data to the fountain component

### Particle System
The `WaterParticles` component:
- Manages up to 50,000 particles (scales with audio intensity)
- Uses custom shaders for rendering water droplets
- Applies physics-based simulation with gravity and velocity
- Synchronizes particle behavior with audio frequency bands
- Implements environment mapping for reflections
- Supports 4 different fountain patterns:
  - **Spray**: Random radial distribution
  - **Cascade**: Horizontal spread with lower velocity
  - **Jet**: Focused vertical stream
  - **Circular**: Radial pattern creating dome shape

### Lighting
The `LightSystem` component:
- Creates dynamic point lights that respond to audio
- Rotates lights around the fountain
- Adjusts intensity based on overall audio level

### Control Panel
The `ControlPanel` component:
- Provides real-time control for all visual effects
- Manages bloom effect settings (toggle and intensity)
- Handles fountain pattern selection and auto-switching
- Controls water color selection
- Adjusts physics parameters (particle count, gravity)
- Manages camera preset selection

### Camera System
The `CameraController` component:
- Implements smooth cinematic transitions between presets
- Uses cubic easing for natural camera movement
- Maintains orbit controls functionality
- Supports 6 predefined camera angles with smooth interpolation

### Post-Processing
The `EffectComposer` with `Bloom`:
- Applies glow effect to bright particles
- Uses luminance threshold for selective blooming
- Adjustable intensity for different visual styles
- Optimized for performance with height resolution

## Performance Optimization

- Particle count scales dynamically with audio intensity (5,000 to 50,000)
- Uses BufferGeometry for efficient particle rendering
- Implements level-of-detail based on audio analysis
- Uses additive blending for visual appeal
- Suspended animation when audio is paused

## Default Music Tracks

1. Song 1 - spa1.mp3
2. Song 2 - science-documentary
3. Song 3 - funny-running
4. Song 4 - mozart-piano-sonata
5. Song 5 - fur-elise-beethoven
6. Song 6 - big-jason
7. Song 7 - glossy
8. Song 8 - perfect-beauty

## Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio processing

## Contact

For any questions or feedback, please open an issue in the GitHub repository.