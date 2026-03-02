#!/usr/bin/env node

/**
 * optimize.mjs — GLB Asset Optimization Pipeline
 *
 * Takes a raw GLB file and applies Draco compression + mesh optimization.
 * Uses @gltf-transform/core and @gltf-transform/extensions.
 *
 * Usage:
 *   node tools/optimize.mjs <input.glb> [output.glb]
 *
 * Example:
 *   node tools/optimize.mjs public/models/raw/valve.glb public/models/valve-optimized.glb
 *
 * Requirements:
 *   npm install -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf
 *
 * Pipeline:
 *   1. Read raw GLB
 *   2. Deduplicate accessors
 *   3. Apply Draco mesh compression
 *   4. Quantize vertex attributes
 *   5. Write optimized GLB
 *
 * This script demonstrates a production asset pipeline.
 * Even without a real GLB model, the architecture is ready.
 */

import { readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, basename, dirname, join } from 'path';

// Format bytes to human-readable
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════╗
║  GLB Optimization Pipeline                   ║
║  Draco Compression + Mesh Optimization       ║
╚══════════════════════════════════════════════╝

Usage:
  node tools/optimize.mjs <input.glb> [output.glb]

Example:
  node tools/optimize.mjs public/models/raw/valve.glb public/models/valve.glb

Pipeline Steps:
  1. Deduplicate accessors
  2. Draco mesh compression
  3. Quantize vertex attributes
  4. Prune unused resources

Requirements (install before running):
  npm install -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf
`);
    process.exit(0);
  }

  const inputPath = resolve(args[0]);
  const outputPath = args[1]
    ? resolve(args[1])
    : join(dirname(inputPath), `${basename(inputPath, '.glb')}-optimized.glb`);

  console.log('\n🔧 GLB Optimization Pipeline');
  console.log('─'.repeat(40));

  // Check input file
  try {
    const inputStats = statSync(inputPath);
    console.log(`📂 Input:  ${inputPath}`);
    console.log(`   Size:   ${formatBytes(inputStats.size)}`);
  } catch {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  try {
    // Dynamic imports for optional dependencies
    const { NodeIO } = await import('@gltf-transform/core');
    const { dedup, quantize, prune } = await import('@gltf-transform/functions');
    const { KHRDracoMeshCompression } = await import('@gltf-transform/extensions');
    const draco3d = await import('draco3dgltf');

    // Initialize Draco encoder/decoder
    const io = new NodeIO()
      .registerExtensions([KHRDracoMeshCompression])
      .registerDependencies({
        'draco3d.encoder': await draco3d.createEncoderModule(),
        'draco3d.decoder': await draco3d.createDecoderModule(),
      });

    console.log('\n⏳ Processing...');

    // Read
    const document = await io.read(inputPath);

    // Optimize
    console.log('   ✓ Deduplicating accessors...');
    await document.transform(dedup());

    console.log('   ✓ Pruning unused resources...');
    await document.transform(prune());

    console.log('   ✓ Quantizing vertex attributes...');
    await document.transform(quantize());

    console.log('   ✓ Applying Draco compression...');
    document.createExtension(KHRDracoMeshCompression).setRequired(true);

    // Write
    await io.write(outputPath, document);

    const outputStats = statSync(outputPath);
    const inputStats = statSync(inputPath);
    const ratio = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`\n📦 Output: ${outputPath}`);
    console.log(`   Size:   ${formatBytes(outputStats.size)}`);
    console.log(`\n📊 Compression: ${ratio}% reduction`);
    console.log('─'.repeat(40));
    console.log(`   Raw:       ${formatBytes(inputStats.size)}`);
    console.log(`   Optimized: ${formatBytes(outputStats.size)}`);
    console.log('─'.repeat(40));
    console.log('✅ Done!\n');
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes('Cannot find')) {
      console.log('\n⚠️  Optional dependencies not installed.');
      console.log('   To enable Draco compression, run:');
      console.log('   npm install -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf\n');

      // Fallback: just copy the file as a demonstration
      console.log('   Falling back to file copy...');
      const data = readFileSync(inputPath);
      writeFileSync(outputPath, data);
      console.log(`   📦 Copied to: ${outputPath}\n`);
    } else {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
  }
}

main();
