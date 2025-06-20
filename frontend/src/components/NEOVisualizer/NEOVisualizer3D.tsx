import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface NEOVisualizer3DProps {
  earthSize?: number;
  neos: any[];
  onNEOClick?: (neo: any) => void;
}

const NEOVisualizer3D: React.FC<NEOVisualizer3DProps> = ({ earthSize = 1, neos, onNEOClick }) => {
  // Animate NEOs in orbit
  const NEOsGroup = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      }
    });
    return (
      <group ref={groupRef}>
        {neos.slice(0, 30).map((neo, i) => {
          // Distribute NEOs in random orbits
          const angle = (i / 30) * Math.PI * 2;
          const radius = earthSize + 0.5 + (i % 5) * 0.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(angle * 2) * 0.2;
          return (
            <mesh
              key={neo.id}
              position={[x, y, z]}
              onClick={() => onNEOClick && onNEOClick(neo)}
            >
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color={neo.is_potentially_hazardous_asteroid ? '#FF6B6B' : '#FFD700'} />
            </mesh>
          );
        })}
      </group>
    );
  };

  return (
    <div style={{ width: '100%', height: 400, position: 'relative', zIndex: 1 }}>
      <Canvas camera={{ position: [0, 0, 3] }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={2000} factor={2} fade speed={1} />
        {/* Earth */}
        <mesh>
          <sphereGeometry args={[earthSize, 64, 64]} />
          <meshPhongMaterial color="#4A90E2" opacity={0.8} />
        </mesh>
        {/* NEOs */}
        <NEOsGroup />
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
      </Canvas>
    </div>
  );
};

export default NEOVisualizer3D; 