import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  PerspectiveCamera,
  ContactShadows,
  Sparkles,
} from '@react-three/drei';

const Wheel = ({ position }) => {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.34, 0.34, 0.18, 32]} />
      <meshStandardMaterial
        color="#090909"
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  );
};

const Rim = ({ position }) => {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.18, 0.18, 0.19, 24]} />
      <meshStandardMaterial
        color="#b8c4d6"
        metalness={1}
        roughness={0.18}
      />
    </mesh>
  );
};

const HeadLight = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.42, 0.14, 0.06]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  );
};

const Car = () => {
  const carRef = useRef();

  useFrame((state) => {
    if (!carRef.current) return;

    const time = state.clock.getElapsedTime();

    carRef.current.rotation.y =
      Math.sin(time * 0.35) * 0.16;

    carRef.current.rotation.x =
      Math.sin(time * 0.5) * 0.015;
  });

  return (
    <group ref={carRef} rotation={[0, -0.35, 0]}>

      {/* Main body */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.9, 0.65, 1.65]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Front hood */}
      <mesh position={[1.55, 0.72, 0]}>
        <boxGeometry args={[1.15, 0.28, 1.52]} />
        <meshStandardMaterial
          color="#172033"
          metalness={0.95}
          roughness={0.16}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[-0.35, 1.02, 0]}>
        <boxGeometry args={[1.95, 0.7, 1.42]} />
        <meshStandardMaterial
          color="#0b101a"
          metalness={0.65}
          roughness={0.2}
        />
      </mesh>

      {/* Front windshield */}
      <mesh
        position={[0.52, 1.05, 0]}
        rotation={[0, 0, -0.25]}
      >
        <boxGeometry args={[0.62, 0.58, 1.44]} />
        <meshStandardMaterial
          color="#07111e"
          metalness={0.4}
          roughness={0.08}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[-0.48, 1.42, 0]}>
        <boxGeometry args={[1.35, 0.12, 1.32]} />
        <meshStandardMaterial
          color="#090d15"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Side accent */}
      <mesh position={[0, 0.55, 0.84]}>
        <boxGeometry args={[3.25, 0.055, 0.035]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[2.08, 0.38, 0]}>
        <boxGeometry args={[0.18, 0.3, 1.45]} />
        <meshStandardMaterial
          color="#07090d"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Headlights */}
      <HeadLight position={[2.15, 0.68, 0.52]} />
      <HeadLight position={[2.15, 0.68, -0.52]} />

      {/* Wheels */}
      <Wheel position={[1.18, 0.28, 0.84]} />
      <Wheel position={[1.18, 0.28, -0.84]} />
      <Wheel position={[-1.25, 0.28, 0.84]} />
      <Wheel position={[-1.25, 0.28, -0.84]} />

      {/* Rims */}
      <Rim position={[1.18, 0.28, 0.84]} />
      <Rim position={[1.18, 0.28, -0.84]} />
      <Rim position={[-1.25, 0.28, 0.84]} />
      <Rim position={[-1.25, 0.28, -0.84]} />

      {/* Rear light */}
      <mesh position={[-2.05, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.13, 1.15]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2}
        />
      </mesh>

    </group>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[5.2, 2.8, 6.5]}
        fov={42}
      />

      <ambientLight intensity={0.7} />

      <directionalLight
        position={[5, 6, 5]}
        intensity={3}
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={12}
        distance={10}
        color="#3b82f6"
      />

      <pointLight
        position={[-4, 2, -2]}
        intensity={8}
        distance={10}
        color="#ffffff"
      />

      <Float
        speed={1.4}
        rotationIntensity={0.15}
        floatIntensity={0.35}
      >
        <Car />
      </Float>

      <Sparkles
        count={70}
        scale={[7, 4, 5]}
        size={1.2}
        speed={0.25}
        opacity={0.45}
      />

      <ContactShadows
        position={[0, -0.12, 0]}
        opacity={0.55}
        scale={8}
        blur={2.5}
        far={4}
      />

      <Environment preset="city" />
    </>
  );
};

export const ThreeCarScene = () => {
  return (
    <div className="three-car-scene">
      <Canvas
        dpr={[1, 1.7]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};