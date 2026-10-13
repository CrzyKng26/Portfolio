import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Keep source captures intact; produce smaller, locally hosted website assets.
await mkdir('public/images/profile', { recursive: true });
await sharp('artifacts/source-media/kannan-passport.png')
  .resize({ width: 560, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile('public/images/profile/kannan-passport.webp');

for (const name of ['hooked-tales-site', 'hokkaido-site', 'v20-site', 'v20-entry']) {
  await sharp(`public/images/projects/${name}.jpg`)
    .webp({ quality: 90 })
    .toFile(`public/images/projects/${name}.webp`);
}
