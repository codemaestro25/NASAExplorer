import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { EONETEvent } from '../../types/nasa';
import LoadingSpinner from '../common/LoadingSpinner';

const EarthContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  // background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
  [theme.breakpoints.down('sm')]: {
    height: '60vh',
  },
}));

interface Earth3DProps {
  events: EONETEvent[];
  neos: any[];
  onEventClick: (event: EONETEvent) => void;
  onNEOClick: (neo: any) => void;
  scrollProgress: number; // 0 = EONET, 1 = NEOs
  rotationSpeed?: number;
}

// Convert lat/lon to 3D position on sphere
const latLonToVector3 = (lat: number, lon: number, radius: number = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const EarthScene: React.FC<Earth3DProps> = ({ events, neos, onEventClick, onNEOClick, scrollProgress, rotationSpeed = 0.1 }) => {
  const [hoveredEvent, setHoveredEvent] = useState<EONETEvent | null>(null);

  const [isEarthHovered, setIsEarthHovered] = useState(false);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
 
  const earthGroupRef = React.useRef<THREE.Group>(null);
  const neosGroupRef = React.useRef<THREE.Group>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load texture manually
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/earthmap.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        setEarthTexture(texture);
        setTextureLoaded(true);
      
      },
      undefined,
      () => {
        setTextureLoaded(false);
      }
    );
  }, []);

  useFrame(() => {
    // Default rotation speed when not hovered
    const defaultRotationSpeed = 0.5;
    const currentRotationSpeed = isEarthHovered ? 0 : defaultRotationSpeed;
    
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += currentRotationSpeed * 0.002;
    }
    if (neosGroupRef.current) neosGroupRef.current.rotation.y += rotationSpeed * 0.0001;
  });

  // Earth scale and transition
  const earthScale = 1 - 0.5 * scrollProgress;
  const earthY = -0.5 * scrollProgress;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} />
      <Stars radius={100} depth={50} count={isMobile ? 1000 : 2000} factor={2} fade speed={1} />
      
      {/* Earth sphere */}
      <group ref={earthGroupRef} scale={earthScale} position={[0, earthY, 0]}>
        <mesh 
          onPointerOver={() => setIsEarthHovered(true)}
          onPointerOut={() => setIsEarthHovered(false)}
          rotation={[0, 0, 0]}
        >
          {textureLoaded && earthTexture ? (
            <>
              <sphereGeometry args={[1, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
              <meshStandardMaterial 
                map={earthTexture}
                transparent
                opacity={1.0}
                metalness={0.1}
                roughness={0.8}
              />
            </>
          ) : (
            <>
              <sphereGeometry args={[1, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          <meshPhongMaterial 
            color={isEarthHovered ? "#7BB3F0" : "#4A90E2"} 
            opacity={0.8} 
          />
            </>
          )}
        </mesh>
        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[1.02, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          <meshBasicMaterial color="#4A90E2" transparent opacity={0.1} />
        </mesh>
        {/* EONET Event markers */}
        <group>
          {events.map((event) => {
            if (event.geometry && event.geometry.length > 0) {
              const coords = event.geometry[0].coordinates;
              if (coords.length >= 2) {
                const [lon, lat] = coords;
                const position = latLonToVector3(lat, lon, 1.05);
                return (
                  <group key={event.id} position={position}>
                    <mesh
                      onClick={() => {
                        onEventClick(event);
                      }}
                      onPointerOver={() => setHoveredEvent(event)}
                      onPointerOut={() => setHoveredEvent(null)}
                      visible={scrollProgress < 0.95}
                    >
                      <sphereGeometry args={[isMobile ? 0.03 : 0.02, 8, 8]} />
                      <meshBasicMaterial 
                        color={event.categories[0]?.id === 'wildfires' ? '#FF6B6B' : 
                               event.categories[0]?.id === 'severe-storms' ? '#FFA726' :
                               event.categories[0]?.id === 'volcanoes' ? '#FF6B6B' :
                               '#4A90E2'}
                        transparent
                        opacity={1 - scrollProgress}
                      />
                    </mesh>
                    {/* Glow effect for markers */}
                    <mesh visible={scrollProgress < 0.95}>
                      <sphereGeometry args={[isMobile ? 0.04 : 0.03, 8, 8]} />
                      <meshBasicMaterial 
                        color={event.categories[0]?.id === 'wildfires' ? '#FF6B6B' : 
                               event.categories[0]?.id === 'severe-storms' ? '#FFA726' :
                               event.categories[0]?.id === 'volcanoes' ? '#FF6B6B' :
                               '#4A90E2'}
                        transparent
                        opacity={0.3 * (1 - scrollProgress)}
                      />
                    </mesh>
                    {hoveredEvent?.id === event.id && scrollProgress < 0.95 && (
                      <Html position={[0, 0.1, 0]} center>
                        <Box
                          sx={{
                            background: 'rgba(26, 26, 46, 0.9)',
                            border: '1px solid rgba(74, 144, 226, 0.3)',
                            borderRadius: 2,
                            padding: { xs: 0.5, md: 1 },
                            minWidth: { xs: 150, md: 200 },
                            maxWidth: { xs: 200, md: 250 },
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Typography 
                            variant={isMobile ? "caption" : "subtitle2"} 
                            color="primary" 
                            sx={{
                              fontWeight: 'bold',
                              fontSize: { xs: '0.75rem', md: '0.875rem' }
                            }}
                          >
                            {event.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="white" 
                            sx={{
                              mt: { xs: 1, md: 3 },
                              fontSize: { xs: '0.625rem', md: '0.75rem' }
                            }}
                          >
                            {event.categories[0]?.title}
                          </Typography>
                        </Box>
                      </Html>
                    )}
                  </group>
                );
              }
            }
            return null;
          })}
        </group>
        {/* near earth objects */}
        <group ref={neosGroupRef} visible={scrollProgress > 0.05}>
          {neos.map((neo: any, i: number) => {
            // Use real miss distance (in km), scaled to fit in the frame
            let radius = 1.3;
            const cad = neo.close_approach_data && neo.close_approach_data[0];
            if (cad && cad.miss_distance && cad.miss_distance.kilometers) {
              // Scale: 0 km = 1.3, 10 million km = 2.5
              const km = parseFloat(cad.miss_distance.kilometers);
              // Clamp and scale for visualization
              const minKm = 384400; // Moon distance
              const maxKm = 10000000; // 10 million km
              const clampedKm = Math.max(minKm, Math.min(maxKm, km));
              radius = 1.3 + ((clampedKm - minKm) / (maxKm - minKm)) * (2.5 - 1.3);
            }
            // Distribute angles evenly
            const angle = (i / 30) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.sin(angle * 2) * 0.2;
            return (
              <mesh
                key={neo.id}
                position={[x, y, z]}
                onClick={() => onNEOClick(neo)}
                onPointerOver={() => setHoveredNEO(neo)}
                onPointerOut={() => setHoveredNEO(null)}
                visible={scrollProgress > 0.05}
              >
                <sphereGeometry args={[isMobile ? 0.06 : 0.04, 12, 12]} />
                <meshStandardMaterial 
                  color={neo.is_potentially_hazardous_asteroid ? '#FF6B6B' : '#FFD700'} 
                  transparent
                  opacity={scrollProgress}
                />
              </mesh>
            );
          })}
        </group>
      </group>
      <CameraControls isEarthHovered={isEarthHovered} isMobile={isMobile} />
    </>
  );
};

// Camera controls component
const CameraControls: React.FC<{ isEarthHovered: boolean; isMobile: boolean }> = ({ isEarthHovered, isMobile }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 3);
  }, [camera]);

  return (
    <OrbitControls
      enablePan={true}
      enableZoom={isEarthHovered || isMobile} // zoom when earth is hovered or on mobile
      enableRotate={true}
      minDistance={isMobile ? 2.5 : 2}
      maxDistance={isMobile ? 4 : 5}
      autoRotate={false}
      autoRotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={isMobile ? 0.5 : 1}
      zoomSpeed={isMobile ? 0.5 : 1}
    />
  );
};

const Earth3D: React.FC<Earth3DProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), isMobile ? 1000 : 2000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <EarthContainer>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <LoadingSpinner size={60} />
        </Box>
      )}
      <Canvas 
        camera={{ 
          position: [0, 0, 3], 
          fov: isMobile ? 70 : 60 
        }} 
        style={{ 
          background: 'transparent',
          touchAction: 'pan-y'
        }}
        dpr={isMobile ? 1 : window.devicePixelRatio}
      >
        <EarthScene {...props} rotationSpeed={props.rotationSpeed} />
      </Canvas>
    </EarthContainer>
  );
};

export default Earth3D; 