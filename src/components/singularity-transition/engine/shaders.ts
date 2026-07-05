/**
 * shaders.ts — All GLSL source strings for the singularity transition system.
 * Three.js prepends precision qualifiers automatically — do not add them here.
 * Palette: cyan #00f5ff  |  indigo #5b21b6  |  space-void #020408
 */

export const GARGANTUA_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { 
    vUv = uv; 
    gl_Position = vec4(position, 1.0); 
  }
`;

export const GARGANTUA_FRAG = /* glsl */`
  uniform sampler2D uTex;
  uniform vec2      uSingUV;
  uniform vec2      uResolution;
  uniform float     uTime;
  uniform float     uProgress;      // 0.0 to 1.0 (Radius of BH)
  uniform float     uDiskIntensity; // Glow strength
  uniform float     uWarpStrength;  // Background lensing strength
  uniform float     uAlpha;         // Fade out overlay
  varying vec2      vUv;

  // Simple procedural noise
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
    // Normalize coordinates to properly handle aspect ratio
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (vUv - uSingUV) * aspect;
    float r = length(p);

    // Event Horizon radius (grows as transition progresses)
    float rs = uProgress * 0.35; 

    // --- 1. GRAVITATIONAL LENSING OF BACKGROUND ---
    // Deflection of light rays around the singularity
    float deflection = (rs * rs) / max(r, 0.001) * uWarpStrength;
    
    // Frame dragging (spin of the black hole twists space)
    float rot = deflection * 3.0 * uProgress;
    float s = sin(rot), c = cos(rot);
    vec2 pRot = vec2(p.x * c - p.y * s, p.x * s + p.y * c);

    // Calculate where to sample the background texture
    // ADD deflection so that pixels near the BH sample from far away (pulling the UI IN)
    vec2 lensedP = normalize(pRot) * (length(pRot) + deflection * 5.0);
    vec2 bgUv = clamp(uSingUV + lensedP / aspect, 0.001, 0.999);
    
    // Intense chromatic aberration near the event horizon
    float ab = uProgress * 0.03 * (rs / max(r, 0.01));
    vec2 abDir = normalize(p) / aspect * ab;
    
    float bgR = texture2D(uTex, bgUv + abDir).r;
    float bgG = texture2D(uTex, bgUv).g;
    float bgB = texture2D(uTex, bgUv - abDir).b;
    vec3 bgColor = vec3(bgR, bgG, bgB);

    // --- 2. ACCRETION DISK (GARGANTUA EFFECT) ---
    vec3 diskColor = vec3(0.0);
    float diskInner = rs * 1.5;
    float diskOuter = rs * 5.0;
    
    if (uDiskIntensity > 0.0 && uProgress > 0.01) {
        float t = uTime * 2.0;

        // Front Disk (Flat ellipse in the XZ plane, viewed edge-on)
        float tilt = 4.0; 
        vec2 pFront = vec2(p.x, p.y * tilt);
        float rFront = length(pFront);
        
        // Evaluate Front Disk
        if (rFront > diskInner && rFront < diskOuter) {
            float normalizedR = (rFront - diskInner) / (diskOuter - diskInner);
            // Swirling plasma noise
            float noiseVal = fbm(vec2(atan(pFront.y, pFront.x) * 3.0 - t, normalizedR * 10.0));
            
            // Relativistic Doppler Beaming
            // Approaching side (left) is brighter and bluer, receding (right) is dimmer and indigo
            float doppler = pFront.x / max(rFront, 0.001); // -1 to 1
            float intensity = (1.0 - doppler * 0.5) * (1.0 - normalizedR);
            intensity *= smoothstep(0.0, 0.1, normalizedR) * smoothstep(1.0, 0.8, normalizedR); 
            
            vec3 hotCyan = vec3(0.0, 0.95, 1.0);
            vec3 deepIndigo = vec3(0.36, 0.13, 0.95);
            vec3 col = mix(hotCyan, deepIndigo, (doppler + 1.0) * 0.5);
            
            // Mask out the part of the disk that is "behind" the black hole
            float zMask = smoothstep(-rs*0.5, rs*0.5, -p.y); 
            
            diskColor += col * intensity * noiseVal * 4.0 * uDiskIntensity * zMask;
        }
        
        // Back Disk (The Halo arc over and under the event horizon)
        // Light from the disk behind the black hole is bent up and down.
        // We map the visual distance 'r' back to the physical disk radius.
        float rBackPhysical = (rs * rs * 1.5) / max(r - rs * 1.05, 0.001);
        
        if (rBackPhysical > diskInner && rBackPhysical < diskOuter) {
            float normalizedR = (rBackPhysical - diskInner) / (diskOuter - diskInner);
            
            // The angle for the back disk is inverted
            float angleBack = atan(-p.y, -p.x);
            float noiseVal = fbm(vec2(angleBack * 3.0 - t, normalizedR * 10.0));
            
            float doppler = -p.x / max(r, 0.001); 
            float intensity = (1.0 - doppler * 0.5) * (1.0 - normalizedR);
            intensity *= smoothstep(0.0, 0.1, normalizedR) * smoothstep(1.0, 0.8, normalizedR);
            
            vec3 hotCyan = vec3(0.0, 0.95, 1.0);
            vec3 deepIndigo = vec3(0.36, 0.13, 0.95);
            vec3 col = mix(hotCyan, deepIndigo, (doppler + 1.0) * 0.5);
            
            // Dim the halo relative to the front disk
            diskColor += col * intensity * noiseVal * 2.0 * uDiskIntensity;
        }
    }

    // --- 3. EVENT HORIZON & PHOTON RING ---
    // Pure black circle at the center
    float inBH = smoothstep(rs * 1.02, rs * 0.98, r); 
    
    // Photon Ring: Superheated light trapped just outside the event horizon
    float photonRing = smoothstep(rs * 1.08, rs * 1.0, r) * smoothstep(rs * 0.92, rs * 1.0, r);
    diskColor += vec3(0.8, 0.9, 1.0) * photonRing * 3.0 * uDiskIntensity * uProgress;

    // --- 4. FINAL COMPOSITION ---
    // Combine background and disk, then punch out the black hole void
    vec3 finalColor = mix(bgColor + diskColor, vec3(0.0), inBH * uWarpStrength);
    
    // Add an outer vignette that darkens the whole screen as the black hole grows
    float vignette = mix(1.0, 1.0 - smoothstep(0.4, 2.0, r), uProgress * uWarpStrength);
    
    gl_FragColor = vec4(finalColor * vignette, uAlpha);
  }
`;
