import { Suspense, Component, type ReactNode } from 'react';
import { SceneRoot } from '../scene/SceneRoot';
import { ControlPanel } from '../ui/ControlPanel';
import { Loader } from '../ui/Loader';

/**
 * Error boundary to catch and display runtime errors
 * instead of showing a blank screen.
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40,
          color: '#ff6600',
          background: '#111',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          height: '100%',
          overflow: 'auto',
        }}>
          <h2>⚠️ Runtime Error</h2>
          <p>{this.state.error?.message}</p>
          <pre style={{ fontSize: 11, color: '#888', marginTop: 16 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * App — root layout component.
 *
 * Layout: sidebar (ControlPanel) + main viewport (SceneRoot)
 * The 3D scene is wrapped in Suspense with a Loader fallback.
 */
export function App() {
  return (
    <ErrorBoundary>
      <div className="app-layout">
        <ControlPanel />
        <main className="viewport">
          <Suspense fallback={<Loader />}>
            <SceneRoot />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}
