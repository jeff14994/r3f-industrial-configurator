import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useConfiguratorStore } from '../state/store';
import { setMeshColor, setMeshHighlight } from '../utils/materialHelpers';

/**
 * Procedural industrial product — a valve/pump assembly.
 * Each named group represents a configurable part:
 * Body, Panel, Cover, Arm, Base
 *
 * In production, this would be replaced by a loaded GLB model.
 * The architecture (selection, color, variant) remains identical.
 */
export function Product() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());

  const selectedMesh = useConfiguratorStore((s) => s.selectedMesh);
  const partColors = useConfiguratorStore((s) => s.partColors);
  const activeVariant = useConfiguratorStore((s) => s.activeVariant);
  const setSelectedMesh = useConfiguratorStore((s) => s.setSelectedMesh);

  // Register mesh ref
  const registerMesh = (name: string) => (ref: THREE.Mesh | null) => {
    if (ref) {
      meshRefs.current.set(name, ref);
    }
  };

  // Apply colors from store
  useEffect(() => {
    meshRefs.current.forEach((mesh, name) => {
      const color = partColors[name];
      if (color) {
        setMeshColor(mesh, color);
      }
    });
  }, [partColors]);

  // Apply selection highlight
  useEffect(() => {
    meshRefs.current.forEach((mesh, name) => {
      setMeshHighlight(mesh, name === selectedMesh);
    });
  }, [selectedMesh]);

  const handleClick = (name: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedMesh(selectedMesh === name ? null : name);
  };

  const isHeavyDuty = activeVariant === 'heavy-duty';

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base Platform */}
      <mesh
        ref={registerMesh('Base')}
        position={[0, 0, 0]}
        onClick={handleClick('Base')}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, 0.2, 1.6]} />
        <meshStandardMaterial color={partColors.Base} roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Body — main cylinder */}
      <mesh
        ref={registerMesh('Body')}
        position={[0, 0.7, 0]}
        onClick={handleClick('Body')}
        castShadow
      >
        <cylinderGeometry args={[0.5, 0.55, 1.0, 32]} />
        <meshStandardMaterial color={partColors.Body} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Body flange top */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
        <meshStandardMaterial color={partColors.Body} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Body flange bottom */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
        <meshStandardMaterial color={partColors.Body} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Panel — side control box */}
      <mesh
        ref={registerMesh('Panel')}
        position={[0.9, 0.55, 0]}
        onClick={handleClick('Panel')}
        castShadow
      >
        <boxGeometry args={[0.5, 0.7, 0.8]} />
        <meshStandardMaterial color={partColors.Panel} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Panel screen */}
      <mesh position={[1.16, 0.6, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.4]} />
        <meshStandardMaterial color="#1a3a2a" roughness={0.1} metalness={0.2} emissive="#0a2a1a" emissiveIntensity={0.5} />
      </mesh>

      {/* Cover — top dome */}
      <mesh
        ref={registerMesh('Cover')}
        position={[0, 1.55, 0]}
        onClick={handleClick('Cover')}
        castShadow
      >
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={partColors.Cover} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Arm — actuator arm */}
      <mesh
        ref={registerMesh('Arm')}
        position={[-0.8, 0.9, 0]}
        rotation={[0, 0, Math.PI / 6]}
        onClick={handleClick('Arm')}
        castShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        <meshStandardMaterial color={partColors.Arm} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Arm joint */}
      <mesh position={[-0.5, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={partColors.Arm} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Arm handle */}
      <mesh position={[-1.15, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#cc3333" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Pipe connections */}
      <mesh position={[0, 0.7, 0.65]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#666666" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, -0.65]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#666666" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Pipe flanges */}
      <mesh position={[0, 0.7, 0.92]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, -0.92]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* === VARIANT: Heavy-Duty extras === */}
      {isHeavyDuty && (
        <group>
          {/* Reinforcement ribs */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`rib-${i}`}
              position={[
                Math.cos((i * Math.PI) / 2) * 0.58,
                0.7,
                Math.sin((i * Math.PI) / 2) * 0.58,
              ]}
              rotation={[0, -(i * Math.PI) / 2, 0]}
              castShadow
            >
              <boxGeometry args={[0.04, 0.8, 0.15]} />
              <meshStandardMaterial color="#777777" roughness={0.4} metalness={0.8} />
            </mesh>
          ))}

          {/* Extra gauge on top */}
          <mesh position={[0.3, 1.5, 0.3]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.3, 1.58, 0.3]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#222222" roughness={0.1} metalness={0.3} />
          </mesh>

          {/* Safety valve */}
          <mesh position={[-0.3, 1.4, -0.3]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 0.3, 12]} />
            <meshStandardMaterial color="#cc3333" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Wider base for heavy-duty */}
          <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.1, 2.0]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.4} />
          </mesh>
        </group>
      )}

      {/* Pressure gauge (standard) */}
      <mesh position={[0.35, 1.15, 0.35]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.35, 1.21, 0.35]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.2} />
      </mesh>
    </group>
  );
}
