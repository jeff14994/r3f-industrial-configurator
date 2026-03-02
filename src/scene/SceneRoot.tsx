import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Product } from './Product';
import { InstancedDetails } from './InstancedDetails';
import { useConfiguratorStore } from '../state/store';

// Lazy-loaded environment preset — demonstrates production lazy loading
const LazyEnvironment = lazy(() =>
  import('@react-three/drei').then((mod) => ({
    default: () => <mod.Environment preset="warehouse" background={false} />,
  }))
);

/**
 * SceneRoot — the main 3D canvas and scene graph.
 *
 * Architecture:
 * - Canvas with linear tone mapping for accurate PBR
 * - Damped OrbitControls for smooth camera
 * - HDR environment for realistic reflections
 * - Directional key light with shadows
 * - ContactShadows for grounded feel
 * - r3f-perf overlay (toggleable)
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
      {/* Performance overlay */}
      {showPerf && <Perf position="top-left" />}

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />

      {/* Environment (lazy loaded) */}
      <Suspense fallback={<Environment preset="city" background={false} />}>
        <LazyEnvironment />
      </Suspense>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Contact shadows for grounded feel */}
      <ContactShadows
        position={[0, -0.99, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
      />

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
