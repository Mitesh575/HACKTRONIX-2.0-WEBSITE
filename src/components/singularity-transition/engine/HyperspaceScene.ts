import * as THREE from 'three';

export class HyperspaceScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  
  private linesGeometry!: THREE.BufferGeometry;
  private lineMaterial!: THREE.LineBasicMaterial;
  private lineCount = 4000;
  
  public uniforms: {
    uTime: { value: number };
    uSpeed: { value: number };
    uOpacity: { value: number };
  };

  constructor(width: number, height: number) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 100;

    this.uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uOpacity: { value: 0 }
    };

    this.buildTunnel();
  }

  private buildTunnel() {
    this.linesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.lineCount * 2 * 3); // 2 vertices per line, 3 coords per vertex
    const colors = new Float32Array(this.lineCount * 2 * 3);

    // Cyan -> Indigo palette
    const cyan = new THREE.Color(0x00f5ff);
    const indigo = new THREE.Color(0x5b21b6);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < this.lineCount; i++) {
      // Random position on a tube
      const radius = 20 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Random depth along the Z axis (camera looks down -Z)
      const z = -Math.random() * 800;

      // Line start
      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      // Line end (will be stretched by vertex shader or JS, here we just set a baseline)
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - 10;

      // Color selection
      const r = Math.random();
      let c: THREE.Color;
      if (r < 0.2) c = white;
      else if (r < 0.6) c = cyan;
      else c = indigo;

      colors[i * 6 + 0] = c.r; colors[i * 6 + 1] = c.g; colors[i * 6 + 2] = c.b;
      colors[i * 6 + 3] = c.r; colors[i * 6 + 4] = c.g; colors[i * 6 + 5] = c.b;
    }

    this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.linesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Simple material, opacity controlled globally
    this.lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lines = new THREE.LineSegments(this.linesGeometry, this.lineMaterial);
    this.scene.add(lines);
  }

  public update(dt: number) {
    if (this.uniforms.uOpacity.value <= 0) return;

    this.lineMaterial.opacity = this.uniforms.uOpacity.value;
    
    // Stretch lines based on speed, and move them towards camera
    const positions = this.linesGeometry.attributes.position.array as Float32Array;
    const speed = this.uniforms.uSpeed.value * 600 * dt; // Units per second
    const stretch = 1.0 + this.uniforms.uSpeed.value * 40.0;

    for (let i = 0; i < this.lineCount; i++) {
      // V1 is the "front" (closer to camera, higher Z)
      // V2 is the "back" (further from camera, lower Z)
      
      let zFront = positions[i * 6 + 2];
      
      // Move forward
      zFront += speed;
      
      // If it passes camera, loop to back
      if (zFront > 100) {
        zFront = -800;
      }

      // Update positions
      positions[i * 6 + 2] = zFront;
      // V2 (back) trails V1 by 'stretch' amount
      positions[i * 6 + 5] = zFront - stretch;
    }
    
    this.linesGeometry.attributes.position.needsUpdate = true;
    
    // Zoom FOV for speed effect
    this.camera.fov = 75 + this.uniforms.uSpeed.value * 40;
    this.camera.updateProjectionMatrix();
  }

  public resize(w: number, h: number) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
