import { Suspense } from 'react';
import { SceneRoot } from '../scene/SceneRoot';
import { ControlPanel } from '../ui/ControlPanel';
import { Loader } from '../ui/Loader';

/**
 * App — root layout component.
 *
 * Layout: sidebar (ControlPanel) + main viewport (SceneRoot)
 * The 3D scene is wrapped in Suspense with a Loader fallback.
 */
export function App() {
  return (
    <div className="app-layout">
      <ControlPanel />
      <main className="viewport">
        <Suspense fallback={<Loader />}>
          <SceneRoot />
        </Suspense>
      </main>
    </div>
  );
}
