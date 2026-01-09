export const vertexShader = `
  attribute vec3 velocity;
  attribute float size;

  uniform float time;
  uniform float intensity;

  varying vec3 vPosition;
  varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vEyeVector;

  void main() {
    vPosition = position;
    vNormal = normalize(position);  // ใช้ตำแหน่งเป็น normal สำหรับอนุภาค

    vec3 pos = position + velocity * intensity * time;

    // ป้องกันค่า NaN
   pos = vec3(
    isnan(pos.x) ? 0.0 : pos.x,
    isnan(pos.y) ? 0.0 : pos.y,
    isnan(pos.z) ? 0.0 : pos.z
  );


    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `

uniform sampler2D diffuseTexture;
uniform samplerCube envMap;
uniform vec3 color;
uniform float intensity;
uniform vec3 lightPosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vEyeVector;

const int MAX_STEPS = 100;
const float MAX_DIST = 100.0;
const float SURF_DIST = 0.01;

// Signed Distance Function for a sphere
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

// Ray marching function
float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = sdSphere(p, 1.0);
        dO += dS;
        if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }
    
    return dO;
}

// Volumetric lighting function
vec3 volumetricLighting(vec3 ro, vec3 rd, float depth) {
    vec3 lightPos = lightPosition;
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    
    float stepSize = depth / 10.0;
    vec3 step = rd * stepSize;
    vec3 pos = ro;
    
    vec3 scattering = vec3(0.0);
    
    for(int i = 0; i < 10; i++) {
        vec3 lightDir = normalize(lightPos - pos);
        float lightDist = rayMarch(pos, lightDir);
        
        if(lightDist < length(lightPos - pos)) {
            scattering += exp(-lightDist * 0.1) * lightColor * 0.1;
        }
        
        pos += step;
    }
    
    return scattering;
}

void main() {
    vec4 diffuseColor = texture2D(diffuseTexture, gl_PointCoord);
    vec3 viewDir = normalize(vPosition);
    vec3 reflectDir = reflect(viewDir, vNormal);
    vec3 envColor = textureCube(envMap, reflectDir).rgb;
    
    float depth = rayMarch(vWorldPosition, vEyeVector);
    vec3 volumetricLight = volumetricLighting(vWorldPosition, vEyeVector, depth);
    
    vec3 finalColor = mix(color, envColor, 0.3) * diffuseColor.rgb + volumetricLight;
    float alpha = diffuseColor.a * intensity;

    gl_FragColor = vec4(finalColor, alpha);
}
`;