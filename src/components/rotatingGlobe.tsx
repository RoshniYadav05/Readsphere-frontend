"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Suspense } from "react";

function RotatingBook() {
  const texture = useTexture("/book-texture.jpg"); // Ensure you have a book texture image in public folder

  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      {/* Book Shape */}
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function RotatingBookScene() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />

          {/* Rotating Book */}
          <RotatingBook />
          
          {/* Controls */}
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
