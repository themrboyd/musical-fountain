# Musical Fountain Project

A 3D musical fountain simulation that responds to music in real-time. The fountain's water particles, lights, and effects dynamically change based on audio input, creating a mesmerizing visual experience.

## Features

- Real-time audio analysis and visualization
- Dynamic 3D particle system for water simulation
- Custom GLSL shaders for realistic water effects
- Interactive camera controls (OrbitControls)
- Multiple pre-loaded music tracks
- Custom audio file upload support
- Environment mapping for reflections
- Dynamic lighting synchronized with music beats
- Play/Pause controls

## Technologies Used

- **React 18.3.1** - UI framework
- **Three.js 0.166.1** - 3D graphics library
- **React Three Fiber 8.16.8** - React renderer for Three.js
- **@react-three/drei 9.109.2** - Helper utilities for React Three Fiber
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
│   │   ├── Fountain.js         # Main fountain component
│   │   ├── WaterParticles.js   # Particle system for water
│   │   ├── LightSystem.js      # Dynamic lighting
│   │   └── FountainBase.js     # Fountain base geometry
│   ├── shaders.js              # GLSL shader code
│   ├── App.js                  # Main application component
│   └── AudioAnalyzer.module.css  # Styling for audio controls
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

1. **Select Music**: Choose from 8 pre-loaded tracks or upload your own audio file
2. **Play/Pause**: Click the Play button to start the music and fountain animation
3. **Explore**: Use mouse to rotate, zoom, and pan around the 3D scene
4. **Experience**: Watch the fountain react to different frequencies and beats

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

### Lighting
The `LightSystem` component:
- Creates dynamic point lights that respond to audio
- Rotates lights around the fountain
- Adjusts intensity based on overall audio level

### Shaders
- **Vertex Shader**: Handles particle positioning, size, and movement
- **Fragment Shader**: Renders water appearance with transparency and reflections
- Uses environment cube map for realistic light reflections

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