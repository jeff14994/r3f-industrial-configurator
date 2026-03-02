import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Product } from './Product';
import { InstancedDetails } from './InstancedDetails';
import { useConfiguratorStore } from '../state/store';

/**
 * Lazy-load r3f-perf to demonstrate lazy loading pattern
 * and avoid potential compatibility issues at startup.
 */
function PerfMonitor() {
  const [PerfComponent, setPerfComponent] = useState<React.ComponentType<{
    position: string;
  }> | null>(null);

  useEffect(() => {
    import('r3f-perf').then((mod) => {
      setPerfComponent(() => mod.Perf);
    }).catch(() => {
      console.warn('r3f-perf failed to load');
    });
  }, []);

  if (!PerfComponent) return null;
  return <PerfComponent position="top-left" />;
}

/**
 * SceneRoot — the main 3D canvas and scene graph.
 *
 * Architecture:
 * - Canvas with PBR-ready settings
 * - Damped OrbitControls for smooth camera
 * - HDR environment for realistic reflections (lazy via Suspense)
 * - Directional key light with shadows
 * - r3f-perf overlay (toggleable, lazy loaded)
 */
export function SceneRoot() {
  const showPerf = useConfiguratorStore((s) => s.showPerf);
  const setSelectedMesh = useConfiguratorStore((s) => s.setSelectedMesh);

  return (
    <Canvas
      camera={{ position: [3, 2.5, 3], fov: 45, near: 0.1, far: 100 }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onPointerMissed={() => setSelectedMesh(null)}
      style={{ background: '#1a1a1a' }}
    >
      {/* Performance overlay — lazy loaded */}
      {showPerf && <PerfMonitor />}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} />

      {/* Environment for reflections — lazy loaded via Suspense */}
      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} />
      </Suspense>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Product assembly */}
      <Product />

      {/* Instanced bolts */}
      <InstancedDetails />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.3, 0]}
      />
    </Canvas>
  );
}
