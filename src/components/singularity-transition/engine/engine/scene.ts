import * as THREE from "three";
import { QualityPreset, COLORS } from "../transition.config.ts";
import { makeField } from "./particles";
import {
  RING_VERTEX_SHADER,
  RING_FRAGMENT_SHADER,
  DISTORT_VERTEX_SHADER,
  DISTORT_FRAGMENT_SHADER,
} from "./shaders";

export class SingularityScene {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Particle Fields
  public starField!: THREE.Points;
  public dustField!: THREE.Points;

  // Core Group
  public coreGroup: THREE.Group;
  public ring: THREE.Mesh;
  public core: THREE.Mesh;
  public ringMat: THREE.ShaderMaterial;

  // Distortion (balanced/ultra only)
  public distortRenderer: THREE.WebGLRenderer | null = null;
  public distortScene: THREE.Scene | null = null;
  public distortCamera: THREE.OrthographicCamera | null = null;
  public distortMat: THREE.ShaderMaterial | null = null;
  public sceneRenderTarget: THREE.WebGLRenderTarget | null = null;

  // Shared Animation Values
  public pullAmount = 0;
  public singularityWorld = new THREE.Vector3(0, 0, 0);
  public coreScale = 0.0001;
  public distortionStrength = 0;
  public aberrationAmount = 0;
  public cameraShake = 0;

  // Uniform refs
  public uniforms: {
    uTime: { value: number };
    uPull: { value: number };
    uCenter: { value: THREE.Vector3 };
  };

  private resizeHandler: () => void;

  constructor(
    sceneCanvas: HTMLCanvasElement,
    distortCanvas: HTMLCanvasElement,
    preset: QualityPreset,
    usePostDistortion: boolean
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: sceneCanvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(preset.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 8;

    // Set up shared uniform references
    this.uniforms = {
      uTime: { value: 0 },
      uPull: { value: 0 },
      uCenter: { value: this.singularityWorld },
    };

    // Initialize Fields
    this.rebuildFields(preset);

    // Singularity Core Setup
    this.coreGroup = new THREE.Group();
    this.coreGroup.visible = false;
    this.scene.add(this.coreGroup);

    const ringGeo = new THREE.RingGeometry(0.001, 0.002, 64);
    this.ringMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uColorA: { value: new THREE.Color(COLORS.blueWhite) },
        uColorB: { value: new THREE.Color(COLORS.accentViolet) },
        uTime: { value: 0 },
      },
      vertexShader: RING_VERTEX_SHADER,
      fragmentShader: RING_FRAGMENT_SHADER,
    });
    this.ring = new THREE.Mesh(ringGeo, this.ringMat);

    const coreGeo = new THREE.CircleGeometry(0.001, 48);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    this.core.position.z = 0.001;

    this.coreGroup.add(this.ring, this.core);

    // Setup post distortion if needed
    if (usePostDistortion) {
      this.setupDistortion(distortCanvas, preset);
    }

    // Resize Handler
    this.resizeHandler = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (this.distortRenderer && this.sceneRenderTarget) {
        this.distortRenderer.setSize(window.innerWidth, window.innerHeight);
        this.sceneRenderTarget.setSize(
          window.innerWidth * preset.dpr,
          window.innerHeight * preset.dpr
        );
      }
    };
    window.addEventListener("resize", this.resizeHandler);
  }

  public rebuildFields(preset: QualityPreset) {
    if (this.starField) {
      this.scene.remove(this.starField);
      this.starField.geometry.dispose();
      (this.starField.material as THREE.ShaderMaterial).dispose();
    }
    if (this.dustField) {
      this.scene.remove(this.dustField);
      this.dustField.geometry.dispose();
      (this.dustField.material as THREE.ShaderMaterial).dispose();
    }

    this.starField = makeField(
      preset.particles,
      14,
      3.2,
      COLORS.starWhite,
      -2,
      this.uniforms
    );
    this.dustField = makeField(
      preset.dust,
      8,
      1.6,
      COLORS.blueWhite,
      1,
      this.uniforms
    );

    this.scene.add(this.starField, this.dustField);
    this.renderer.setPixelRatio(preset.dpr);
    if (this.distortRenderer && this.sceneRenderTarget) {
      this.distortRenderer.setPixelRatio(preset.dpr);
      this.sceneRenderTarget.setSize(
        window.innerWidth * preset.dpr,
        window.innerHeight * preset.dpr
      );
    }
  }

  private setupDistortion(
    distortCanvas: HTMLCanvasElement,
    preset: QualityPreset
  ) {
    this.distortRenderer = new THREE.WebGLRenderer({
      canvas: distortCanvas,
      alpha: true,
      antialias: false,
    });
    this.distortRenderer.setPixelRatio(preset.dpr);
    this.distortRenderer.setSize(window.innerWidth, window.innerHeight);

    this.sceneRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth * preset.dpr,
      window.innerHeight * preset.dpr
    );

    this.distortScene = new THREE.Scene();
    this.distortCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.distortMat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: this.sceneRenderTarget.texture },
        uStrength: { value: 0.0 },
        uAberration: { value: 0.0 },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: DISTORT_VERTEX_SHADER,
      fragmentShader: DISTORT_FRAGMENT_SHADER,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.distortMat);
    this.distortScene.add(quad);
  }

  public screenToWorld(clientX: number, clientY: number): THREE.Vector3 {
    const ndc = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(this.camera);
    const dir = vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  public update(t: number) {
    this.uniforms.uTime.value = t;
    this.uniforms.uPull.value = this.pullAmount;

    if (this.coreGroup.visible) {
      this.coreGroup.position.copy(this.singularityWorld);
      this.ring.scale.setScalar(this.coreScale);
      this.core.scale.setScalar(this.coreScale * 0.55);
      this.ring.rotation.z += 0.01 + this.pullAmount * 0.04;
      this.ringMat.uniforms.uTime.value = t;
    }

    if (this.cameraShake > 0.0001) {
      this.camera.position.x = (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y = (Math.random() - 0.5) * this.cameraShake;
    } else {
      this.camera.position.x = 0;
      this.camera.position.y = 0;
    }

    if (this.distortRenderer && this.distortScene && this.distortCamera && this.sceneRenderTarget && this.distortMat) {
      this.distortRenderer.setRenderTarget(this.sceneRenderTarget);
      this.distortRenderer.render(this.scene, this.camera);
      this.distortRenderer.setRenderTarget(null);
      this.distortMat.uniforms.uStrength.value = this.distortionStrength;
      this.distortMat.uniforms.uAberration.value = this.aberrationAmount;
      this.distortRenderer.render(this.distortScene, this.distortCamera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  public dispose() {
    window.removeEventListener("resize", this.resizeHandler);

    this.starField.geometry.dispose();
    (this.starField.material as THREE.ShaderMaterial).dispose();

    this.dustField.geometry.dispose();
    (this.dustField.material as THREE.ShaderMaterial).dispose();

    this.ring.geometry.dispose();
    this.ringMat.dispose();

    this.core.geometry.dispose();
    (this.core.material as THREE.MeshBasicMaterial).dispose();

    this.renderer.dispose();

    if (this.distortRenderer) {
      this.distortRenderer.dispose();
    }
    if (this.sceneRenderTarget) {
      this.sceneRenderTarget.dispose();
    }
    if (this.distortMat) {
      this.distortMat.dispose();
    }
  }
}
