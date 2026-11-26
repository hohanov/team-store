import { copyFile, readFile, writeFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const deploymentHtml = html.replaceAll('./dist/', './');
await writeFile('dist/index.html', deploymentHtml);
await copyFile('catalog.html', 'dist/catalog.html');
await copyFile('styles.css', 'dist/styles.css');
await copyFile('node_modules/bootstrap/dist/css/bootstrap.min.css', 'dist/bootstrap.min.css');
