import { create } from 'zustand';

export type VariantType = 'standard' | 'heavy-duty';

export interface ConfiguratorState {
  // Selection
  selectedMesh: string | null;
  setSelectedMesh: (name: string | null) => void;

  // Colors for named parts
  partColors: Record<string, string>;
  setPartColor: (partName: string, color: string) => void;

  // Variant
  activeVariant: VariantType;
  setActiveVariant: (variant: VariantType) => void;

  // Performance overlay
  showPerf: boolean;
  togglePerf: () => void;

  // Loading
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  // Selection
  selectedMesh: null,
  setSelectedMesh: (name) => set({ selectedMesh: name }),

  // Colors — defaults for configurable parts
  partColors: {
    Body: '#4a6741',
    Panel: '#2d4a6f',
    Cover: '#8b4513',
    Arm: '#555555',
    Base: '#333333',
  },
  setPartColor: (partName, color) =>
    set((state) => ({
      partColors: { ...state.partColors, [partName]: color },
    })),

  // Variant
  activeVariant: 'standard',
  setActiveVariant: (variant) => set({ activeVariant: variant }),

  // Performance overlay
  showPerf: false,
  togglePerf: () => set((state) => ({ showPerf: !state.showPerf })),

  // Loading
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
}));
