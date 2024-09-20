"use client"

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 1000, size }: { count: number; size: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const light = useRef<THREE.PointLight>(null!)

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -size/2 + Math.random() * size
      const yFactor = -size/2 + Math.random() * size
      const zFactor = -size/2 + Math.random() * size
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count, size])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      const {factor, speed, xFactor, yFactor, zFactor } = particle
      const tNew = particle.t += speed / 2
      const a = Math.cos(tNew) + Math.sin(tNew * 1) / 10
      const b = Math.sin(tNew) + Math.cos(tNew * 2) / 10
      const s = Math.cos(tNew)
      particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01
      particle.my += (state.mouse.y * 1000 - 1 - particle.my) * 0.01
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((tNew / 10) * factor) + (Math.sin(tNew * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((tNew / 10) * factor) + (Math.cos(tNew * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((tNew / 10) * factor) + (Math.sin(tNew * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="white" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.5]} /> {/* 增大颗粒体积 */}
        <meshPhongMaterial color="#0066cc" /> {/* 深蓝色 */}
      </instancedMesh>
    </>
  )
}

function Cube({ size }: { size: number }) {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null!)

  useEffect(() => {
    if (lineSegmentsRef.current) {
      const geometry = new THREE.BoxGeometry(size, size, size)
      const edges = new THREE.EdgesGeometry(geometry)
      const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
      lineSegmentsRef.current.geometry = edges
      lineSegmentsRef.current.material = material
    }
  }, [size])

  return (
    <group>
      <lineSegments ref={lineSegmentsRef} />
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.0} side={THREE.BackSide} /> {/* 完全透明 */}
      </mesh>
    </group>
  )
}

export default function ParticleCube() {
  const [size, setSize] = useState(100)

  useEffect(() => {
    const updateSize = () => {
      setSize(window.innerHeight / 3)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, size * 1.5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <Particles count={1000} size={size} /> {/* 减少粒子数量以适应更大的颗粒 */}
      <Cube size={size} />
      <OrbitControls />
    </Canvas>
  )
}