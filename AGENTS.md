# AGENTS.md - Agent Guidelines for Musical Fountain Project

This file contains essential information for agentic coding assistants working on this repository.

## Build, Lint, and Test Commands

### Development
```bash
npm start              # Start development server on port 3007
npm run build          # Build for production (PUBLIC_URL=.)
```

### Testing
```bash
npm test               # Run all tests in watch mode
npm test -- --watchAll=false  # Run tests once and exit
npm test -- --coverage  # Generate coverage report
```

### Running Single Test
```bash
npm test -- <test-file-path>
# Example: npm test -- src/components/AudioAnalyzer.test.js
```

Note: This project uses Create React App's default test setup with Jest and React Testing Library. No custom lint or typecheck commands are configured.

## Code Style Guidelines

### Import Order and Formatting
1. React imports first
2. Third-party libraries
3. Three.js imports
4. React Three Fiber imports
5. Local imports (components, utilities)
6. CSS modules (if using)

```javascript
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, useCubeTexture } from '@react-three/drei';
import { vertexShader, fragmentShader } from '../shaders.js';
import styles from '../Component.module.css';
```

### Component Structure
- Use functional components with hooks
- Destructure props in function signature with default values
- Use PascalCase for component names
- Export as default

```javascript
const ComponentName = ({ prop1, prop2 = defaultValue, audioData }) => {
  // Hook calls at top
  const ref = useRef();
  
  // Event handlers
  const handleSomething = useCallback(() => {}, []);
  
  // Effects
  useEffect(() => {}, []);
  
  // Render
  return <group ref={ref} />;
};

export default ComponentName;
```

### Naming Conventions
- **Components**: PascalCase (`WaterParticles`, `FountainBase`)
- **Functions/Variables**: camelCase (`resetParticle`, `positions`, `velocities`)
- **Constants**: UPPERCASE (`MAX_STEPS`, `MAX_DIST`)
- **Refs**: camelCase with "Ref" suffix (`meshRef`, `lightRef`, `groupRef`)
- **State**: camelCase, descriptive (`isPlaying`, `isLoading`, `error`)
- **Files**: PascalCase for components (`AudioAnalyzer.js`), lowercase for utilities

### Three.js Patterns
- Use `useMemo` for expensive geometry and material creation
- Use `useFrame` for animation loops
- Use `useRef` for mutable references to Three.js objects
- Use BufferGeometry with BufferAttribute for particles
- Use ShaderMaterial for custom rendering effects

```javascript
const geometry = useMemo(() => {
  return new THREE.BufferGeometry();
}, [dependencies]);

useFrame((state, delta) => {
  // Animation logic
});
```

### Error Handling
- Use try-catch blocks in async functions
- Maintain error state with useState
- Display errors in UI with user-friendly messages
- Log errors to console for debugging

```javascript
const [error, setError] = useState(null);

const handleAction = async () => {
  try {
    await asyncOperation();
  } catch (error) {
    console.error("Error:", error);
    setError("Failed to complete operation");
  }
};
```

### Shaders
- Store GLSL shaders in template strings in `src/shaders.js`
- Export as named exports: `vertexShader`, `fragmentShader`
- Use consistent uniform naming (lowercase with underscores: `diffuseTexture`, `envMap`)
- Add comments in Thai for complex shader logic

### Audio Processing
- Use Web Audio API through React refs
- Initialize AudioContext lazily on user interaction
- Extract frequency data using FFT with fftSize 2048
- Calculate bass (0-200Hz), mid (200-2000Hz), treble (2000-20000Hz) averages
- Detect beats based on bass intensity threshold

```javascript
const averageFrequencyRange = (dataArray, startFreq, endFreq) => {
  const startIndex = Math.floor(startFreq / 22050 * dataArray.length);
  const endIndex = Math.floor(endFreq / 22050 * dataArray.length);
  // Calculate average...
};
```

### Particle System Optimization
- Scale particle count dynamically (5,000 - 50,000) based on audio intensity
- Use Float32Array for positions, velocities, sizes
- Implement NaN checks before updating positions
- Reset particles that go out of bounds
- Use additive blending for visual effect

### CSS Modules
- Import with `.module.css` extension
- Use BEM-like naming for classes
- Define styles in separate CSS module files

```javascript
import styles from './Component.module.css';

<div className={styles.container} />
```

### Comments
- Use Thai comments for business logic and user-facing features
- Use English for technical documentation
- Add inline comments for complex algorithms
- Comment shader uniforms and varying variables

```javascript
// สร้างไฟ LED จำนวน 8 ดวง
const lights = useMemo(() => {
  return Array(8).fill().map((_, index) => {
    // ...
  });
}, []);
```

### Props and State
- Provide default values for optional props
- Use destructuring with defaults
- Keep state minimal and localized
- Lift state up when shared components need access

```javascript
const Component = ({ 
  intensity = 1,
  radius = 2,
  audioData 
}) => {
  const [localState, setLocalState] = useState(defaultValue);
};
```

### React Three Fiber Specific
- Use primitive components: `<mesh>`, `<group>`, `<points>`
- Use HTML overlays with `<Html>` from @react-three/drei
- Wrap async components in `<Suspense>`
- Use Environment component for reflections
- Position camera with proper fov

```javascript
<Canvas camera={{ position: [0, 3, 6], fov: 60 }}>
  <Suspense fallback={<Html>Loading...</Html>}>
    <Component />
  </Suspense>
</Canvas>
```

## Performance Considerations
- Memoize expensive computations with useMemo
- Use useCallback for event handlers
- Implement level-of-detail for particle systems
- Suspend animation when not needed (e.g., paused audio)
- Use BufferAttribute for large arrays

## Testing Notes
- Tests use Jest and React Testing Library
- Test files should be named `ComponentName.test.js`
- No tests currently exist in the codebase
- When adding tests, follow React Testing Library best practices

## Project-Specific Constants
- Audio sample rate: 22050 Hz
- FFT size: 2048
- Base particle count: 5,000
- Max particle count: 50,000
- Beat detection threshold: bass > 200
- Environment map path: `/images/envmap/`
- Dev server port: 3007
