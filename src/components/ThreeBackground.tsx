'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedShapes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      group.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={group}>
      {/* Saffron Distorted Sphere */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[-3, 1, -5]}>
          <MeshDistortMaterial 
            color="#E6A15C" 
            attach="material" 
            distort={0.4} 
            speed={2} 
            roughness={0.2}
            metalness={0.1}
          />
        </Sphere>
      </Float>

      {/* Terracotta Distorted Sphere */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[4, -1, -3]}>
          <MeshDistortMaterial 
            color="#C86A46" 
            attach="material" 
            distort={0.5} 
            speed={1.5} 
            roughness={0.2}
            metalness={0.1}
          />
        </Sphere>
      </Float>

      {/* Small Warm Orange Sphere */}
      <Float speed={3} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.5, 32, 32]} position={[2, 3, -4]}>
          <meshStandardMaterial color="#D97746" roughness={0.3} metalness={0.2} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-cream pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#E6A15C" />
        <AnimatedShapes />
      </Canvas>
    </div>
  );
}
