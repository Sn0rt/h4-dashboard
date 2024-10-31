"use client"

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense } from 'react';
import { MeshStandardMaterial, Object3D, Mesh } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function DogModel() {
  const obj = useLoader(OBJLoader, '/3d/dog.obj');

  obj.traverse((child: Object3D) => {
    if (child instanceof Mesh) {
      child.material = new MeshStandardMaterial({
        color: '#6B7280',
        roughness: 0.6,
        metalness: 0.1,
        flatShading: false,
        transparent: true,
        opacity: 0.9,
      });
    }
  });

  return (
    <primitive
      object={obj}
      position={[0, -1.5, 0]}
      scale={[0.05, 0.05, 0.05]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

export default function Dog3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={0.4}
            adjustCamera={false}
          >
            <DogModel />
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              castShadow
            />
          </Stage>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.5}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}