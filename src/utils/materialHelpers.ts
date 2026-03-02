import * as THREE from 'three';

/**
 * Clone materials on a mesh to avoid shared material mutation.
 * This is critical when multiple meshes share the same material instance —
 * modifying one would affect all others.
 */
export function cloneMaterials(object: THREE.Object3D): void {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else {
        mesh.material = mesh.material.clone();
      }
    }
  });
}

/**
 * Set the color of a specific material on a mesh.
 * Handles both single and multi-material meshes.
 */
export function setMeshColor(mesh: THREE.Mesh, color: string): void {
  const applyColor = (mat: THREE.Material) => {
    if ((mat as THREE.MeshStandardMaterial).color) {
      (mat as THREE.MeshStandardMaterial).color.set(color);
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(applyColor);
  } else {
    applyColor(mesh.material);
  }
}

/**
 * Apply emissive highlight to a mesh (selection indicator).
 */
export function setMeshHighlight(
  mesh: THREE.Mesh,
  highlighted: boolean,
  emissiveColor = '#ff6600',
  emissiveIntensity = 0.3
): void {
  const apply = (mat: THREE.Material) => {
    const stdMat = mat as THREE.MeshStandardMaterial;
    if (stdMat.emissive) {
      if (highlighted) {
        stdMat.emissive.set(emissiveColor);
        stdMat.emissiveIntensity = emissiveIntensity;
      } else {
        stdMat.emissive.set('#000000');
        stdMat.emissiveIntensity = 0;
      }
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(apply);
  } else {
    apply(mesh.material);
  }
}

/**
 * Dispose of materials and geometries to prevent memory leaks.
 */
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material?.dispose();
      }
    }
  });
}
