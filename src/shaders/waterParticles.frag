// waterParticles.frag
uniform sampler2D diffuseTexture;
uniform samplerCube envMap;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;

void main() {
  vec4 texColor = texture2D(diffuseTexture, gl_PointCoord);
  
  // Calculate reflection
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 reflectionVector = reflect(viewDirection, vNormal);
  vec4 reflectionColor = textureCube(envMap, reflectionVector);
  
  // Calculate refraction
  float refractionRatio = 1.00 / 1.33; // Air to water ratio
  vec3 refractionVector = refract(viewDirection, vNormal, refractionRatio);
  vec4 refractionColor = textureCube(envMap, refractionVector);
  
  // Mix colors
  vec4 finalColor = mix(refractionColor, reflectionColor, 0.5);
  finalColor = mix(finalColor, vec4(vColor, 1.0), 0.5);
  
  gl_FragColor = finalColor * texColor.a;
}