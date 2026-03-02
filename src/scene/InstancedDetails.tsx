import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const BOLT_COUNT = 500;
const BOLT_RADIUS = 0.02;
const BOLT_HEIGHT = 0.04;

// Deterministic pseudo-random for stable renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/**
 * InstancedDetails — renders 500 bolts using a single InstancedMesh.
 *
 * Without instancing: 500 draw calls
 * With instancing: 1 draw call
 *
 * This is the single most impactful optimization for scenes with
 * repeated geometry. Each bolt gets a unique transform via the
 * instance matrix, but shares geometry and material.
 */
export function InstancedDetails() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-compute all bolt transforms once
  const matrices = useMemo(() => {
    const temp = new THREE.Object3D();
    const result: THREE.Matrix4[] = [];

    // Distribute bolts in patterns around the product
    for (let i = 0; i < BOLT_COUNT; i++) {
      const pattern = i % 4;

      if (pattern === 0) {
        // Ring pattern around base
        const angle = (i / BOLT_COUNT) * Math.PI * 8;
        const radius = 1.0 + Math.sin(i * 0.3) * 0.2;
        temp.position.set(
          Math.cos(angle) * radius,
          -0.42,
          Math.sin(angle) * radius
        );
      } else if (pattern === 1) {
        // Grid on base platform
        const row = Math.floor(i / 20);
        const col = i % 20;
        temp.position.set(
          -1.0 + col * 0.1,
          -0.38,
          -0.7 + row * 0.14
        );
      } else if (pattern === 2) {
        // Flange bolts (circular patterns)
        const flangeIndex = Math.floor(i / 8) % 3;
        const boltAngle = ((i % 8) / 8) * Math.PI * 2;
        const y = flangeIndex === 0 ? 0.18 : flangeIndex === 1 ? 1.25 : 0.7;
        const r = flangeIndex === 2 ? 0.92 : 0.6;
        temp.position.set(
          Math.cos(boltAngle) * r,
          y - 0.5,
          Math.sin(boltAngle) * r
        );
      } else {
        // Scattered structural bolts
        const seed = i * 1.618;
        temp.position.set(
          Math.sin(seed) * 1.5,
          -0.5 + (i % 10) * 0.2,
          Math.cos(seed * 0.7) * 1.2
        );
      }

      temp.rotation.set(
        seededRandom(i * 3) * 0.1,
        seededRandom(i * 3 + 1) * Math.PI * 2,
        seededRandom(i * 3 + 2) * 0.1
      );
      temp.scale.setScalar(0.8 + seededRandom(i * 7) * 0.4);
      temp.updateMatrix();
      result.push(temp.matrix.clone());
    }

    return result;
  }, []);

  // Apply matrices to instanced mesh on mount
  useFrame(() => {
    if (meshRef.current && !meshRef.current.userData.initialized) {
      matrices.forEach((matrix, i) => {
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.userData.initialized = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, BOLT_COUNT]}
      castShadow
      frustumCulled={false}
    >
      <cylinderGeometry args={[BOLT_RADIUS, BOLT_RADIUS, BOLT_HEIGHT, 6]} />
      <meshStandardMaterial
        color="#888888"
        roughness={0.3}
        metalness={0.9}
      />
    </instancedMesh>
  );
}
