// waterParticles.vert
attribute float size;
attribute vec3 velocity;
uniform float time;
uniform float intensity;
uniform vec3 color;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;

// Simple noise function
float noise(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main() {
  vColor = color;
  float noiseValue = noise(position + time * 0.1);
  vec3 pos = position + velocity * mod(time, 10.0) * intensity;
  pos += vec3(noiseValue, noiseValue, noiseValue) * 0.1;
  
  // Calculate normal based on position for simple sphere-like shape
  vNormal = normalize(pos);
  
  vPosition = pos;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}