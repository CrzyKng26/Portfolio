import sharp from 'sharp';

// Encoding/resizing only: the original photograph is never generated or retouched.
for (const width of [720, 1080]) {
  await sharp('public/images/profile/kannan-original.jpg')
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`public/images/profile/kannan-hero-${width}.webp`);
}
await sharp('public/images/projects/porca-vaca-site.jpg')
  .webp({ quality: 90 })
  .toFile('public/images/projects/porca-vaca-site.webp');
