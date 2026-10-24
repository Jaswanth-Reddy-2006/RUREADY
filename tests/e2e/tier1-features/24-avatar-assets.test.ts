import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const modelNames = ['ava', 'elena', 'maya', 'priya'] as const;
const modelsDir = path.resolve(process.cwd(), 'client/public/models');

describe('Feature 24: Interviewer avatar assets', () => {
  it('keeps every configured GLB asset present in the public models directory', () => {
    for (const name of modelNames) {
      const filePath = path.join(modelsDir, `interviewer_${name}.glb`);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  it('keeps the assets in valid GLB container format', () => {
    for (const name of modelNames) {
      const filePath = path.join(modelsDir, `interviewer_${name}.glb`);
      const header = Buffer.alloc(4);
      const handle = fs.openSync(filePath, 'r');
      try {
        fs.readSync(handle, header, 0, 4, 0);
      } finally {
        fs.closeSync(handle);
      }
      expect(header.toString('ascii')).toBe('glTF');
    }
  });

  it('uses public-root model URLs instead of exposing the /public directory', async () => {
    const { getModelAssetPath } = await import('../../../client/src/lib/platformConfig');
    for (const persona of ['AVA', 'ELENA', 'MAYA', 'PRIYA'] as const) {
      const url = getModelAssetPath(persona);
      expect(url).toContain('/models/interviewer_');
      expect(url).not.toContain('/public/');
      expect(url.endsWith('.glb')).toBe(true);
    }
  });
});
