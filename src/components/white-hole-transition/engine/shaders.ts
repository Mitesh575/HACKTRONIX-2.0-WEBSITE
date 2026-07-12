/**
 * shaders.ts — GLSL source strings for the White Hole Expansion transition.
 */

export const WHITE_HOLE_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { 
    vUv = uv; 
    gl_Position = vec4(position, 1.0); 
  }
`;

export const WHITE_HOLE_FRAG = /* glsl */`
  uniform sampler2D uTex;
  uniform vec2      uSingUV;
  uniform vec2      uResolution;
  uniform float     uTime;
  uniform float     uProgress;      // 0.0 to 1.0 (Size of the expansion)
  uniform float     uCoreIntensity; // Brightness of the core
  uniform float     uWarpStrength;  // Outward lens distortion strength
  uniform float     uWhiteout;      // Fade to pure white (0 to 1)
  varying vec2      vUv;

  // Procedural noise for plasma / energy filaments
  float hash(vec2 p) {
      p  = fract( p*0.3183099+.1 );
      p *= 17.0;
      return fract( p.x*p.y*(p.x+p.y) );
  }

  float noise( in vec2 x ) {
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix( mix( hash(p+vec2(0,0)), hash(p+vec2(1,0)),f.x),
                  mix( hash(p+vec2(0,1)), hash(p+vec2(1,1)),f.x),f.y);
  }

  float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p = p * 2.02;
      f += 0.2500 * noise(p); p = p * 2.03;
      f += 0.1250 * noise(p); p = p * 2.01;
      f += 0.0625 * noise(p);
      return f;
  }

  void main() {
    // Aspect ratio correction
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (vUv - uSingUV) * aspect;
    float r = length(p);

    // --- 1. SPATETIME EXPANSION (OUTWARD LENSING) ---
    // In a black hole, we pull light in. In a white hole, we push it out.
    // To make pixels move outward, we sample the texture closer to the center.
    // The force diminishes with distance from the center.
    
    // As uProgress increases, the expanding wavefront moves outward
    float expansionWave = smoothstep(uProgress * 2.5, 0.0, r); 
    float outwardPull = expansionWave * uWarpStrength;
    
    // Deflect the UVs towards the center (causing the image to stretch outwards)
    vec2 dir = normalize(p);
    vec2 lensedUV = vUv - (dir * outwardPull / aspect);
    
    // Clamp to avoid edge artifacts
    lensedUV = clamp(lensedUV, 0.001, 0.999);
    
    // Chromatic Aberration (stretching colors as they explode)
    float abAmount = outwardPull * 0.08;
    vec2 abDir = dir / aspect * abAmount;
    
    float bgR = texture2D(uTex, lensedUV - abDir).r;
    float bgG = texture2D(uTex, lensedUV).g;
    float bgB = texture2D(uTex, lensedUV + abDir).b;
    vec3 bgColor = vec3(bgR, bgG, bgB);

    // --- 2. WHITE HOLE CORE & PLASMA ---
    vec3 energyColor = vec3(0.0);
    
    if (uCoreIntensity > 0.0) {
      // Core singularity (pure white blinding light)
      float coreRadius = uProgress * 0.15;
      float core = smoothstep(coreRadius * 1.5, coreRadius * 0.5, r);
      
      // Corona (hot cyan and violet glow)
      float corona = smoothstep(uProgress * 1.5, 0.0, r);
      
      // Spinning plasma filaments
      float angle = atan(p.y, p.x);
      // Create radial rays that spin
      float rays = fbm(vec2(angle * 4.0 - uTime * 2.0, r * 10.0 - uTime * 3.0));
      // Enhance rays closer to the center
      float rayIntensity = rays * smoothstep(uProgress * 2.0, 0.0, r) * uCoreIntensity;
      
      vec3 colCyan = vec3(0.0, 0.8, 1.0);
      vec3 colViolet = vec3(0.6, 0.2, 1.0);
      vec3 colWhite = vec3(1.0, 1.0, 1.0);
      
      // Mix colors based on distance and noise
      vec3 plasma = mix(colViolet, colCyan, fbm(p * 5.0 + uTime));
      
      energyColor += core * colWhite * uCoreIntensity * 3.0; // Overblown core
      energyColor += corona * plasma * uCoreIntensity * 1.5;
      energyColor += rayIntensity * mix(colCyan, colWhite, 0.5) * 2.0;
    }

    // --- 3. COMPOSITION & WHITEOUT ---
    // Additive blending for light
    vec3 finalColor = bgColor + energyColor;
    
    // Exposure blowout (Whiteout Event)
    // As uWhiteout approaches 1, the entire screen explodes into pure white bloom
    finalColor = mix(finalColor, vec3(1.0), uWhiteout);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
