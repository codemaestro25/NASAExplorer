# Earth 3D Model - Performance Optimized Textures

## Overview
This implementation provides a realistic Earth 3D model with automatic performance optimization based on device capabilities.

## Performance Levels

### 🖥️ High Performance (Desktop)
- **Textures**: 2K resolution (2048x1024)
- **Features**: Full shader effects, animated clouds, specular highlights
- **Geometry**: 128 segments for smooth surface
- **Memory Usage**: ~32MB total

### 📱 Medium Performance (Tablet)
- **Textures**: 1K resolution (1024x512)
- **Features**: Shader effects with reduced complexity
- **Geometry**: 64 segments
- **Memory Usage**: ~8MB total

### 📱 Low Performance (Mobile/Old Devices)
- **Textures**: 512px resolution (512x256)
- **Features**: Basic material, no shaders
- **Geometry**: 32 segments
- **Memory Usage**: ~2MB total

## Automatic Detection

The system automatically detects device capabilities:

```javascript
const getDevicePerformance = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true;
  const hasWebGL2 = !!document.createElement('canvas').getContext('webgl2');
  
  if (isMobile || isLowEnd) return 'low';
  if (hasWebGL2) return 'high';
  return 'medium';
};
```

## Texture Files Required

Place these files in `public/textures/`:

### High Quality (2K)
- `earth_daymap_2k.jpg` - Main Earth texture
- `earth_normal_2k.jpg` - Surface detail
- `earth_specular_2k.jpg` - Shiny areas (oceans)
- `earth_clouds_2k.jpg` - Cloud overlay

### Medium Quality (1K)
- `earth_daymap_1k.jpg`
- `earth_normal_1k.jpg`
- `earth_specular_1k.jpg`
- `earth_clouds_1k.jpg`

### Low Quality (512px)
- `earth_daymap_512.jpg` - Basic Earth texture only

## Download Textures

Run the download script to get optimized textures:

```bash
node download-earth-textures.js
```

## Performance Optimizations

### 1. Adaptive Quality
- Automatically selects texture quality based on device
- Falls back gracefully if textures aren't available

### 2. Memory Management
- Disables mipmaps for better performance
- Uses `ClampToEdgeWrapping` instead of `RepeatWrapping`
- Linear filtering for faster rendering

### 3. Geometry Optimization
- Reduces sphere segments on low-end devices
- Fewer stars in background on mobile
- Simplified marker geometry

### 4. Shader Optimization
- Conditional shader features based on performance
- Reduced animation speed on mobile
- Simplified lighting calculations

## Marker Synchronization

The Earth model uses proper spherical coordinate mapping:

```javascript
const latLonToVector3 = (lat: number, lon: number, radius: number = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};
```

This ensures markers appear at the correct geographical locations on the Earth surface.

## Mobile Performance Tips

1. **Test on real devices** - Emulators may not reflect true performance
2. **Monitor frame rate** - Aim for 30+ FPS on mobile
3. **Reduce texture quality** if experiencing lag
4. **Disable animations** on very low-end devices

## Troubleshooting

### Textures not loading?
- Check file paths in `public/textures/`
- Verify texture files exist
- Check browser console for errors

### Poor performance?
- Reduce texture quality manually
- Disable shaders for low-end devices
- Reduce geometry segments

### Markers not aligned?
- Verify coordinate system (lat/lon format)
- Check texture projection (equirectangular)
- Ensure proper sphere mapping

## Alternative Texture Sources

If the provided textures don't work, try these sources:

1. **NASA Visible Earth**: https://visibleearth.nasa.gov/
2. **Solar System Scope**: https://www.solarsystemscope.com/textures/
3. **Planet Pixels**: https://planetpixels.com/

Ensure textures are in equirectangular projection for proper mapping. 