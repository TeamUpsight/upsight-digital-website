import { open, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const publicDirectory = 'public';
const cloudflareLimit = 25 * 1024 * 1024;
const safetyLimit = 24 * 1024 * 1024;
const testimonialWarningLimit = 20 * 1024 * 1024;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return nested.flat();
}

async function isMp4(path) {
  const file = await open(path, 'r');
  try {
    const header = Buffer.alloc(8);
    await file.read({ buffer: header, position: 0 });
    return header.subarray(4, 8).toString('ascii') === 'ftyp';
  } finally {
    await file.close();
  }
}

const oversizedAssets = [];
for (const path of await filesIn(publicDirectory)) {
  const { size } = await stat(path);
  const asset = relative(publicDirectory, path).replaceAll('\\', '/');
  if (size > safetyLimit) oversizedAssets.push(`${asset} is ${size} bytes; assets must stay below the 24 MiB deployment safety limit.`);
  if (asset.startsWith('videos/testimonials/') && size > testimonialWarningLimit) console.warn(`Warning: ${asset} is ${size} bytes, above the 20 MiB testimonial-video target.`);
  if (size > cloudflareLimit) oversizedAssets.push(`${asset} exceeds Cloudflare Workers' 25 MiB static-asset limit.`);
  if (asset.endsWith('.mp4') && !(await isMp4(path))) oversizedAssets.push(`${asset} is not an MP4 binary file.`);
}

if (oversizedAssets.length) {
  console.error(oversizedAssets.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Static asset size checks passed.');
}
