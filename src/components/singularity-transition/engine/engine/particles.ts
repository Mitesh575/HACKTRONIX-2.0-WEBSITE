import * as THREE from "three";
import { PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER } from "./shaders";

export function makeField(
  count: number,
  spread: number,
  size: number,
  color: number | string,
  depthBase: number,
  uniforms: {
    uTime: { value: number };
    uPull: { value: number };
    uCenter: { value: THREE.Vector3 };
  }
) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count); // per-particle random phase
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = depthBase + (Math.random() - 0.5) * spread * 0.4;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: uniforms.uTime,
      uSize: { value: size },
      uColor: { value: new THREE.Color(color as any) },
      uPull: uniforms.uPull,
      uCenter: uniforms.uCenter,
    },
    vertexShader: PARTICLE_VERTEX_SHADER,
    fragmentShader: PARTICLE_FRAGMENT_SHADER,
  });

  return new THREE.Points(geo, mat);
}
