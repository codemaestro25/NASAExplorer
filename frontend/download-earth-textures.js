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

// Earth texture URLs (from Solar System Scope - free to use)
const textureUrls = {
  // High quality (2K) - for desktop
  'earth_daymap_2k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
  'earth_normal_2k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_normal_2k.jpg',
  'earth_specular_2k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_specular_2k.jpg',
  'earth_clouds_2k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_clouds_2k.jpg',
  
  // Medium quality (1K) - for tablets
  'earth_daymap_1k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_2k.jpg',
  'earth_normal_1k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_normal_1k.jpg',
  'earth_specular_1k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_specular_1k.jpg',
  'earth_clouds_1k.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth_clouds_1k.jpg',
  
  // Low quality (512px) - for mobile
  'earth_daymap_512.jpg': 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_1k.jpg',
};

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

// Download all textures
async function downloadAllTextures() {
  console.log('🌍 Downloading Earth textures...');
  console.log('📁 Saving to:', texturesDir);
  
  const downloadPromises = Object.entries(textureUrls).map(([filename, url]) => 
    downloadFile(url, filename)
  );
  
  await Promise.all(downloadPromises);
  console.log('\n🎉 Download complete!');
  console.log('\n📱 Performance levels:');
  console.log('  • High (Desktop): 2K textures with shaders');
  console.log('  • Medium (Tablet): 1K textures with shaders');
  console.log('  • Low (Mobile): 512px textures, basic material');
}

// Run the download
downloadAllTextures().catch(console.error); 