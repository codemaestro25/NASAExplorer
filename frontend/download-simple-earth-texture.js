import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create textures directory
const texturesDir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Simple Earth texture from a reliable source
const earthTextureUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg';

// Download function
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(texturesDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        resolve(); // Continue with other downloads
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}: ${err.message}`);
      resolve(); // Continue with other downloads
    });
  });
}

// Download Earth texture
async function downloadEarthTexture() {
  console.log('🌍 Downloading Earth texture...');
  console.log('📁 Saving to:', texturesDir);
  
  await downloadFile(earthTextureUrl, 'earth_daymap_2k.jpg');
  
  // Create a copy for medium quality
  const sourcePath = path.join(texturesDir, 'earth_daymap_2k.jpg');
  const mediumPath = path.join(texturesDir, 'earth_daymap_1k.jpg');
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, mediumPath);
    console.log('✅ Created: earth_daymap_1k.jpg (copy of 2k)');
  }
  
  console.log('\n🎉 Download complete!');
  console.log('\n📱 The Earth model will now use:');
  console.log('  • High/Medium: Realistic Earth texture');
  console.log('  • Low: Basic blue sphere (fallback)');
}

// Run the download
downloadEarthTexture().catch(console.error); 