import { useConfiguratorStore } from '../state/store';
import type { VariantType } from '../state/store';

const CONFIGURABLE_PARTS = ['Body', 'Panel', 'Cover', 'Arm', 'Base'] as const;

const COLOR_PRESETS: Record<string, string[]> = {
  Body: ['#4a6741', '#2d4a6f', '#6b3a3a', '#4a4a4a', '#2a5a4a'],
  Panel: ['#2d4a6f', '#4a4a6f', '#3a3a3a', '#5a4a2a', '#2a4a5a'],
  Cover: ['#8b4513', '#4a6741', '#6b3a3a', '#3a3a5a', '#5a5a5a'],
  Arm: ['#555555', '#333333', '#666666', '#444444', '#777777'],
  Base: ['#333333', '#222222', '#444444', '#2a2a2a', '#555555'],
};

const VARIANTS: { key: VariantType; label: string }[] = [
  { key: 'standard', label: 'Standard' },
  { key: 'heavy-duty', label: 'Heavy-Duty' },
];

/**
 * ControlPanel — sidebar UI for the configurator.
 *
 * Controls:
 * - Part selection display
 * - Color customization per part
 * - Variant switching
 * - Performance overlay toggle
 */
export function ControlPanel() {
  const selectedMesh = useConfiguratorStore((s) => s.selectedMesh);
  const partColors = useConfiguratorStore((s) => s.partColors);
  const setPartColor = useConfiguratorStore((s) => s.setPartColor);
  const activeVariant = useConfiguratorStore((s) => s.activeVariant);
  const setActiveVariant = useConfiguratorStore((s) => s.setActiveVariant);
  const showPerf = useConfiguratorStore((s) => s.showPerf);
  const togglePerf = useConfiguratorStore((s) => s.togglePerf);

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h1>Industrial Configurator</h1>
        <p className="subtitle">Valve Assembly — Series V200</p>
      </div>

      {/* Selection info */}
      <section className="panel-section">
        <h2>Selection</h2>
        <div className="selection-display">
          {selectedMesh ? (
            <span className="selected-name">{selectedMesh}</span>
          ) : (
            <span className="no-selection">Click a part to select</span>
          )}
        </div>
      </section>

      {/* Color customization */}
      <section className="panel-section">
        <h2>Colors</h2>
        {CONFIGURABLE_PARTS.map((part) => (
          <div key={part} className={`color-row ${selectedMesh === part ? 'active' : ''}`}>
            <label>{part}</label>
            <div className="color-swatches">
              {COLOR_PRESETS[part].map((color) => (
                <button
                  key={color}
                  className={`swatch ${partColors[part] === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPartColor(part, color)}
                  aria-label={`Set ${part} color to ${color}`}
                />
              ))}
              <input
                type="color"
                value={partColors[part]}
                onChange={(e) => setPartColor(part, e.target.value)}
                className="color-picker"
                aria-label={`Custom color for ${part}`}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Variant switching */}
      <section className="panel-section">
        <h2>Variant</h2>
        <div className="variant-buttons">
          {VARIANTS.map(({ key, label }) => (
            <button
              key={key}
              className={`variant-btn ${activeVariant === key ? 'active' : ''}`}
              onClick={() => setActiveVariant(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Performance toggle */}
      <section className="panel-section">
        <h2>Debug</h2>
        <button
          className={`toggle-btn ${showPerf ? 'active' : ''}`}
          onClick={togglePerf}
        >
          {showPerf ? '📊 Hide Perf' : '📊 Show Perf'}
        </button>
      </section>

      {/* Info footer */}
      <div className="panel-footer">
        <p>500 instanced bolts • 1 draw call</p>
        <p>React Three Fiber • Zustand • TypeScript</p>
      </div>
    </div>
  );
}
