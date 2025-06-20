import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const ParallaxStars: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }}>
      <Canvas camera={{ position: [0, 0, 1] }} style={{ width: '100%', height: '100%' }}>
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
};

export default ParallaxStars; 