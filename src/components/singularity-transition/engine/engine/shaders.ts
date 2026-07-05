// shaders.ts
// Ported scene/shader code from demo.html

export const PARTICLE_VERTEX_SHADER = `
  attribute float seed;
  uniform float uTime;
  uniform float uSize;
  uniform float uPull;
  uniform vec3 uCenter;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // ambient drift, always present
    p.x += sin(uTime * 0.05 + seed) * 0.15;
    p.y += cos(uTime * 0.04 + seed) * 0.15;

    // gravitational pull toward singularity, distance-attenuated,
    // spiraling (angular offset grows with pull) rather than linear
    vec3 toCenter = uCenter - p;
    float dist = max(length(toCenter), 0.001);
    float falloff = 1.0 / (dist * dist * 0.35 + 0.6);
    float pullAmount = uPull * falloff;

    // spiral: rotate the approach vector slightly based on accumulated pull
    float ang = pullAmount * 3.0;
    float ca = cos(ang), sa = sin(ang);
    vec3 dir = normalize(toCenter);
    vec3 spiralDir = vec3(dir.x * ca - dir.y * sa, dir.x * sa + dir.y * ca, dir.z);

    p += spiralDir * pullAmount * 4.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z) * (1.0 + pullAmount * 1.5);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = clamp(1.0 - pullAmount * 0.6, 0.0, 1.0);
  }
`;

export const PARTICLE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, glow * vAlpha);
  }
`;

export const RING_VERTEX_SHADER = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

export const RING_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform vec3 uColorA; uniform vec3 uColorB; uniform float uTime;
  void main(){
    float a = atan(vUv.y-0.5, vUv.x-0.5);
    float mixv = sin(a*3.0+uTime*2.0)*0.5+0.5;
    vec3 col = mix(uColorA, uColorB, mixv);
    gl_FragColor = vec4(col, 0.85);
  }
`;

export const DISTORT_VERTEX_SHADER = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`;

export const DISTORT_FRAGMENT_SHADER = `
  uniform sampler2D uTex;
  uniform float uStrength;
  uniform float uAberration;
  uniform vec2 uCenter;
  varying vec2 vUv;
  void main(){
    vec2 toCenter = vUv - uCenter;
    float dist = length(toCenter);

    // barrel / lensing: push samples toward center more strongly near it
    float lens = uStrength * (1.0 / (dist * 6.0 + 1.0));
    vec2 warped = vUv - toCenter * lens;

    // black hole "eats light" — darken sharply within a shrinking radius
    float holeRadius = uStrength * 0.4;
    float holeMask = smoothstep(holeRadius, holeRadius * 0.4, dist);

    vec2 aberr = normalize(toCenter + 0.0001) * uAberration * dist;
    float r = texture2D(uTex, warped + aberr).r;
    float g = texture2D(uTex, warped).g;
    float b = texture2D(uTex, warped - aberr).b;

    vec3 col = vec3(r,g,b) * holeMask;
    gl_FragColor = vec4(col, 1.0);
  }
`;
